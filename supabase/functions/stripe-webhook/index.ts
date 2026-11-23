// =========================================================
// stripe-webhook
// Stripe calls this after a customer pays. It checks the message
// really came from Stripe, then marks the order as paid.
//
// Secrets this function needs (Supabase -> Edge Functions -> Secrets):
//   STRIPE_WEBHOOK_SECRET   whsec_... (from Stripe -> Developers -> Webhooks)
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are provided by Supabase automatically.
// =========================================================
import { createClient } from "npm:@supabase/supabase-js@2";

const enc = new TextEncoder();
const toHex = (buf: ArrayBuffer) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");

// Same check Stripe's own libraries do: HMAC-SHA256 of "timestamp.body"
export async function verifyStripeSignature(body: string, header: string, secret: string, toleranceSec = 300) {
  const parts = Object.fromEntries(header.split(",").map((kv) => kv.split("=", 2)).filter((p) => p.length === 2).map(([k, v]) => [k.trim(), v]));
  const signatures = header.split(",").filter((p) => p.trim().startsWith("v1=")).map((p) => p.trim().slice(3));
  const t = Number(parts.t);
  if (!t || signatures.length === 0) return false;
  if (Math.abs(Date.now() / 1000 - t) > toleranceSec) return false;
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const expected = toHex(await crypto.subtle.sign("HMAC", key, enc.encode(`${t}.${body}`)));
  return signatures.some((sig) => {
    if (sig.length !== expected.length) return false;
    let diff = 0;
    for (let i = 0; i < sig.length; i++) diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
    return diff === 0;
  });
}

if (import.meta.main) {
  Deno.serve(async (req) => {
    if (req.method !== "POST") return new Response("Use POST", { status: 405 });
    const body = await req.text();
    const ok = await verifyStripeSignature(body, req.headers.get("stripe-signature") ?? "", Deno.env.get("STRIPE_WEBHOOK_SECRET") ?? "");
    if (!ok) return new Response("Bad signature", { status: 400 });

    const event = JSON.parse(body);
    const session = event?.data?.object ?? {};
    const orderId = session?.metadata?.order_id ?? session?.client_reference_id;
    if (!orderId) return new Response("ok");

    const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });

    if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
      if (session.payment_status === "paid") {
        const { error } = await db.from("orders")
          .update({ status: "paid", paid_at: new Date().toISOString() })
          .eq("id", orderId).eq("status", "pending");
        if (error) { console.error(error); return new Response("DB error", { status: 500 }); }
      }
    } else if (event.type === "checkout.session.expired" || event.type === "checkout.session.async_payment_failed") {
      await db.from("orders").update({ status: "cancelled" }).eq("id", orderId).eq("status", "pending");
    }
    return new Response("ok");
  });
}
