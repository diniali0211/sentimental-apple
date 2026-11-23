// =========================================================
// create-checkout
// Saves the order, then opens a Stripe payment page for it.
// Prices are always read from the database here, never trusted from the browser.
//
// Secrets this function needs (Supabase -> Edge Functions -> Secrets):
//   STRIPE_SECRET_KEY   sk_test_... or sk_live_...
//   SITE_URL            e.g. https://diniali0211.github.io/sentimental-apple
// Optional: CURRENCY (default gbp), FREE_SHIPPING_OVER (default 30), SHIPPING_COST (default 3.5),
//           KIT_DISCOUNT (default 0.15), KIT_MIN_PIECES (default 3)
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are provided by Supabase automatically.
// =========================================================
import { createClient } from "npm:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const reply = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

const env = (k: string, fallback = "") => Deno.env.get(k) ?? fallback;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return reply({ error: "Use POST" }, 405);

  try {
    const { items, customer } = await req.json();

    // ---- Check what was sent ----
    if (!Array.isArray(items) || items.length === 0 || items.length > 50) return reply({ error: "Your bag is empty." }, 400);
    const c = customer ?? {};
    const name = String(c.name ?? "").trim().slice(0, 80);
    const email = String(c.email ?? "").trim().slice(0, 120);
    const address = String(c.address ?? "").trim().slice(0, 500);
    const note = String(c.note ?? "").trim().slice(0, 500);
    if (!name || !address || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return reply({ error: "Please fill in your name, a valid email and your address." }, 400);
    }
    // Each bag line is a product { id, qty, variant? } or a journal kit { kit: [ids], qty }
    type Want = { id: string; qty: number; variant: string; kit: string[] | null };
    const wanted: Want[] = [];
    const bad = () => reply({ error: "Something in your bag isn't right. Please refresh and try again." }, 400);
    for (const it of items) {
      const qty = Math.floor(Number(it?.qty));
      if (!Number.isFinite(qty) || qty < 1 || qty > 99) return bad();
      if (Array.isArray(it?.kit)) {
        const kit = it.kit.map((x: unknown) => String(x ?? "")).filter(Boolean);
        if (kit.length === 0 || kit.length > 20) return bad();
        wanted.push({ id: "kit", qty, variant: "", kit });
      } else {
        const id = String(it?.id ?? "");
        if (!id) return bad();
        wanted.push({ id, qty, variant: String(it?.variant ?? "").slice(0, 30), kit: null });
      }
    }
    const allIds = [...new Set(wanted.flatMap((w) => (w.kit ? w.kit : [w.id])))];

    const db = createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"), { auth: { persistSession: false } });

    // ---- Logged-in customer? (guests are fine too) ----
    let userId: string | null = null;
    const token = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
    if (token) {
      const { data } = await db.auth.getUser(token);
      userId = data?.user?.id ?? null;
    }

    // ---- Real prices from the database ----
    const { data: products, error: pErr } = await db
      .from("products").select("id, name, price, sold_out, active, colors").in("id", allIds);
    if (pErr) throw pErr;
    const find = (id: string) => products?.find((x) => x.id === id);
    for (const id of allIds) {
      const p = find(id);
      if (!p || !p.active) return reply({ error: "One of the items in your bag is no longer available." }, 400);
      if (p.sold_out) return reply({ error: `Sorry, ${p.name} has just sold out.` }, 400);
    }
    const kitDiscount = Number(env("KIT_DISCOUNT", "0.15")), kitMin = Number(env("KIT_MIN_PIECES", "3"));
    const lines: { id: string; name: string; price: number; qty: number }[] = [];
    for (const w of wanted) {
      if (w.kit) {
        const parts = w.kit.map(find)!;
        const full = parts.reduce((s, p) => s + Number(p!.price), 0);
        const price = Math.round(full * (parts.length >= kitMin ? 1 - kitDiscount : 1) * 100) / 100;
        lines.push({ id: "kit", name: `Journal kit: ${parts.map((p) => p!.name).join(", ")}`.slice(0, 250), price, qty: w.qty });
      } else {
        const p = find(w.id)!;
        // only accept a colour the product actually comes in
        const colors = Array.isArray(p.colors) ? p.colors.map((c: unknown) => (Array.isArray(c) ? String(c[1]) : String((c as { name?: string })?.name ?? ""))) : [];
        const variant = w.variant && colors.includes(w.variant) ? w.variant : "";
        lines.push({ id: w.id, name: (p.name as string) + (variant ? ` (${variant})` : ""), price: Number(p.price), qty: w.qty });
      }
    }
    const round = (n: number) => Math.round(n * 100) / 100;
    const subtotal = round(lines.reduce((s, l) => s + l.price * l.qty, 0));
    const shipping = subtotal >= Number(env("FREE_SHIPPING_OVER", "30")) ? 0 : Number(env("SHIPPING_COST", "3.5"));
    const total = round(subtotal + shipping);
    const currency = env("CURRENCY", "gbp").toLowerCase();

    // ---- Save the order (status: pending until Stripe confirms payment) ----
    const { data: order, error: oErr } = await db.from("orders")
      .insert({ user_id: userId, name, email, address, note, subtotal, shipping, total, currency })
      .select("id, number").single();
    if (oErr) throw oErr;
    const { error: iErr } = await db.from("order_items")
      .insert(lines.map((l) => ({ order_id: order.id, product_id: l.id === "kit" ? null : l.id, name: l.name, price: l.price, qty: l.qty })));
    if (iErr) throw iErr;

    // ---- Create the Stripe payment page ----
    const site = env("SITE_URL").replace(/\/$/, "");
    const form = new URLSearchParams({
      mode: "payment",
      success_url: `${site}/checkout.html?paid=1&order=${order.number}`,
      cancel_url: `${site}/checkout.html?cancelled=1`,
      customer_email: email,
      client_reference_id: order.id,
      "metadata[order_id]": order.id,
      "metadata[order_number]": String(order.number),
      "payment_intent_data[metadata][order_id]": order.id,
    });
    const stripeLines = lines.map((l) => ({ name: l.name, amount: l.price, qty: l.qty }));
    if (shipping > 0) stripeLines.push({ name: "Shipping", amount: shipping, qty: 1 });
    stripeLines.forEach((l, i) => {
      form.set(`line_items[${i}][quantity]`, String(l.qty));
      form.set(`line_items[${i}][price_data][currency]`, currency);
      form.set(`line_items[${i}][price_data][unit_amount]`, String(Math.round(l.amount * 100)));
      form.set(`line_items[${i}][price_data][product_data][name]`, l.name);
    });

    const res = await fetch(`${env("STRIPE_API_BASE", "https://api.stripe.com")}/v1/checkout/sessions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${env("STRIPE_SECRET_KEY")}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: form,
    });
    const session = await res.json();
    if (!res.ok) {
      console.error("Stripe error", session);
      await db.from("orders").update({ status: "cancelled" }).eq("id", order.id);
      return reply({ error: "We couldn't open the payment page. Please try again in a moment." }, 502);
    }
    await db.from("orders").update({ stripe_session_id: session.id }).eq("id", order.id);

    return reply({ url: session.url, order: order.number });
  } catch (e) {
    console.error(e);
    return reply({ error: "Something went wrong on our side. Please try again." }, 500);
  }
});
