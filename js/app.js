/* =========================================================
   SENTIMENTAL APPLE — SITE BEHAVIOUR
   You don't need to edit this file to change content.
   Edit js/data.js instead.
   ========================================================= */
(function () {
  "use strict";
  const S = window.SITE;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const params = new URLSearchParams(location.search);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const plural = (n, w) => `${n} ${w}${n === 1 ? "" : "s"}`;
  const money = (n) => S.currency + Number(n).toFixed(2);
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const CFG = window.SHOP_CONFIG || {};
  const ONLINE = !!(CFG.supabaseUrl && CFG.supabaseAnonKey); // database switched on in js/config.js?
  let sb = null, currentUser = null, isAdmin = false;

  /* ---------- Safe storage (works even if the browser blocks it) ---------- */
  const store = {
    get(key, fallback) { try { const v = localStorage.getItem("sa_" + key); return v ? JSON.parse(v) : fallback; } catch { return fallback; } },
    set(key, value) { try { localStorage.setItem("sa_" + key, JSON.stringify(value)); } catch { /* ignore */ } },
  };

  /* ---------- Cute drawings ---------- */
  const face = (x, y, s = 1) => `
    <g style="fill:#2e2460">
      <circle cx="${x - 9 * s}" cy="${y}" r="${3.2 * s}"/><circle cx="${x + 9 * s}" cy="${y}" r="${3.2 * s}"/>
    </g>
    <ellipse cx="${x - 16 * s}" cy="${y + 7 * s}" rx="${4.5 * s}" ry="${2.8 * s}" style="fill:#fff;opacity:.55"/>
    <ellipse cx="${x + 16 * s}" cy="${y + 7 * s}" rx="${4.5 * s}" ry="${2.8 * s}" style="fill:#fff;opacity:.55"/>
    <path d="M${x - 4 * s} ${y + 6 * s} q${4 * s} ${4.5 * s} ${8 * s} 0" style="fill:none;stroke:#2e2460;stroke-width:${2.4 * s};stroke-linecap:round"/>`;

  const DRAW = {
    apple: () => `
      <path d="M50 30C36 19 12 24 12 52c0 25 20 41 38 33 18 8 38-8 38-33 0-28-24-33-38-22z" style="fill:var(--c)"/>
      <path d="M50 31c0-8 2-14 6-19" style="fill:none;stroke:#7a5236;stroke-width:5;stroke-linecap:round"/>
      <path d="M56 19c6-10 18-12 24-8-4 9-14 13-24 8z" style="fill:#83c3c3"/>
      <ellipse cx="28" cy="42" rx="5" ry="8" style="fill:#fff;opacity:.45" transform="rotate(25 28 42)"/>
      ${face(50, 56)}`,
    heart: () => `
      <path d="M50 87C21 66 8 48 13 31c5-17 28-21 37-4 9-17 32-13 37 4 5 17-8 35-37 56z" style="fill:var(--c)"/>
      <ellipse cx="29" cy="34" rx="5" ry="8" style="fill:#fff;opacity:.5" transform="rotate(35 29 34)"/>
      ${face(50, 50)}`,
    star: () => `
      <polygon points="50,9 61,37 91,38 67,57 76,87 50,70 24,87 33,57 9,38 39,37" style="fill:var(--c);stroke:var(--c);stroke-width:9;stroke-linejoin:round"/>
      ${face(50, 52, .9)}`,
    cloud: () => `
      <g style="fill:var(--c)"><circle cx="34" cy="58" r="20"/><circle cx="54" cy="44" r="25"/><circle cx="74" cy="60" r="17"/><rect x="22" y="56" width="62" height="22" rx="11"/></g>
      ${face(52, 58, .9)}`,
    flower: () => `
      <g style="fill:var(--c)"><circle cx="50" cy="24" r="16"/><circle cx="75" cy="42" r="16"/><circle cx="66" cy="72" r="16"/><circle cx="34" cy="72" r="16"/><circle cx="25" cy="42" r="16"/></g>
      <circle cx="50" cy="50" r="19" style="fill:#ffe07d"/>
      ${face(50, 49, .7)}`,
    envelope: () => `
      <rect x="10" y="24" width="80" height="56" rx="10" style="fill:var(--c)"/>
      <path d="M14 30l36 26 36-26" style="fill:none;stroke:#fff;stroke-width:5;stroke-linecap:round;stroke-linejoin:round"/>
      <path d="M50 70c-7-5-11-9-9-13 1-3 6-4 9 0 3-4 8-3 9 0 2 4-2 8-9 13z" style="fill:#f45d63"/>`,
    notebook: () => `
      <rect x="20" y="10" width="62" height="80" rx="10" style="fill:var(--c)"/>
      <rect x="20" y="10" width="14" height="80" rx="6" style="fill:#2e2460;opacity:.18"/>
      <rect x="42" y="24" width="30" height="16" rx="5" style="fill:#fff"/>
      <path d="M70 10v30l-6-5-6 5V10" style="fill:#f45d63"/>
      ${face(56, 62, .75)}`,
    cherry: () => `
      <path d="M32 62C38 40 48 22 66 12M68 62c-2-18-2-34-2-50" style="fill:none;stroke:#3e8a4f;stroke-width:5;stroke-linecap:round"/>
      <path d="M66 12c8-4 18 0 20 8-9 3-17 0-20-8z" style="fill:#83c3c3"/>
      <circle cx="31" cy="68" r="19" style="fill:var(--c)"/><circle cx="69" cy="68" r="19" style="fill:var(--c)"/>
      <ellipse cx="24" cy="62" rx="3.5" ry="6" style="fill:#fff;opacity:.5" transform="rotate(30 24 62)"/>
      ${face(31, 70, .55)}${face(69, 70, .55)}`,
    rainbow: () => `
      <g style="fill:none;stroke-width:11;stroke-linecap:round">
        <path d="M14 76a36 36 0 0 1 72 0" style="stroke:#f45d63"/>
        <path d="M26 76a24 24 0 0 1 48 0" style="stroke:#ffe07d"/>
        <path d="M38 76a12 12 0 0 1 24 0" style="stroke:var(--c)"/>
      </g>
      <g style="fill:#fff"><circle cx="16" cy="80" r="9"/><circle cx="26" cy="82" r="8"/><circle cx="84" cy="80" r="9"/><circle cx="74" cy="82" r="8"/></g>`,
    sparkle: () => `
      <path d="M50 6c4 30 14 40 44 44-30 4-40 14-44 44-4-30-14-40-44-44 30-4 40-14 44-44z" style="fill:var(--c)"/>
      <path d="M82 12c1 8 4 11 12 12-8 1-11 4-12 12-1-8-4-11-12-12 8-1 11-4 12-12z" style="fill:#ff8db3"/>
      ${face(50, 52, .7)}`,
  };

  function art(name, color, extra = "") {
    const draw = DRAW[name] || DRAW.apple;
    return `<svg viewBox="0 0 100 100" class="c-${esc(color || "pink")} ${extra}" aria-hidden="true">${draw()}</svg>`;
  }

  const ICON = {
    bag: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1 12H6L5 8z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><path d="M9 10V7a3 3 0 0 1 6 0v3" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
    heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-8.6-9C2.3 7.6 4.6 4.6 7.7 4.6c2 0 3.4 1.2 4.3 2.6.9-1.4 2.3-2.6 4.3-2.6 3.1 0 5.4 3 4.3 6.4C19 15.6 12 20 12 20z" fill="none" stroke="#2e2460" stroke-width="2.2" stroke-linejoin="round"/></svg>',
    chat: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H10l-5 4v-4H6a2 2 0 0 1-2-2V6z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/></svg>',
    menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
    user: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>',
  };

  /* ---------- Lookups ---------- */
  const productById = (id) => S.products.find((p) => p.id === id);
  const catById = (id) => S.categories.find((c) => c.id === id);

  /* ---------- Header, footer, drawer ---------- */
  const page = document.body.dataset.page;
  const NAV = [
    ["index.html", "Home", "home"],
    ["shop.html", "Shop", "shop"],
    ["events.html", "Events", "events"],
    ["journal.html", "Journal", "journal"],
    ["about.html", "Our story", "about"],
    ["style.html", "Your style", "style"],
  ];
  /* the style picked on style.html (see js/theme.js) */
  const styleId = () => document.documentElement.getAttribute("data-style");
  const styleInfo = (id = styleId()) => (S.styles || []).find((x) => x.id === id) || null;
  const styleChip = () => { const st = styleInfo(); return st ? `<a class="style-chip" href="style.html?s=${st.id}" aria-label="Your style: ${esc(st.name)}"><span aria-hidden="true">${st.emoji}</span><span>${esc(st.name)}</span></a>` : ""; };
  const logo = (cls = "") => `<a href="index.html" class="logo ${cls}"><img src="images/logo.webp" alt="${esc(S.name)}" width="640" height="470"></a>`;

  function renderChrome() {
    const ticker = S.announcement.concat(S.announcement).map((t) => `<span>${esc(t)}</span>`).join("");
    document.body.insertAdjacentHTML("afterbegin", `
      <a class="sr-only" href="#main">Skip to content</a>
      <div class="ticker" aria-label="Announcements"><div class="ticker__track">${ticker}</div></div>
      <header class="site-header">
        <div class="wrap site-header__inner">
          ${logo()}
          <nav class="nav" id="nav" aria-label="Main">
            ${NAV.map(([href, label, key]) => `<a href="${href}" ${key === page ? 'aria-current="page"' : ""}>${label}</a>`).join("")}
          </nav>
          <div class="header-actions">
            ${styleChip()}
            <a class="icon-btn" href="shop.html?cat=saved" aria-label="Saved items">${ICON.heart}<span class="badge-count" data-wish-count></span></a>
            ${ONLINE ? `<a class="icon-btn" href="account.html" aria-label="Your account">${ICON.user}</a>` : ""}
            <button class="icon-btn" type="button" data-open-cart aria-label="Open your bag">${ICON.bag}<span class="badge-count" data-cart-count></span></button>
            <button class="icon-btn menu-btn" type="button" aria-label="Menu" aria-expanded="false" aria-controls="nav">${ICON.menu}</button>
          </div>
        </div>
      </header>`);

    const cats = S.categories.map((c) => `<li><a href="shop.html?cat=${c.id}">${esc(c.name)}</a></li>`).join("");
    const soc = Object.entries(S.social).map(([k, v]) => `<li><a href="${esc(v)}" target="_blank" rel="noopener">${k[0].toUpperCase() + k.slice(1)}</a></li>`).join("");
    document.body.insertAdjacentHTML("beforeend", `
      <footer class="site-footer">
        <div class="wrap">
          <div class="footer-grid">
            <div>${logo()}<p style="opacity:.8">${esc(S.tagline)}. Drawn, printed and packed by hand.</p><p style="opacity:.8">${esc(S.contact.email)}<br>${esc(S.contact.hours)}</p></div>
            <div><h3>Shop</h3><ul>${cats}</ul></div>
            <div><h3>Visit</h3><ul><li><a href="about.html">Our story</a></li><li><a href="events.html">Events</a></li><li><a href="journal.html">Journal</a></li><li><a href="brand.html">Brand kit</a></li></ul></div>
            <div><h3>Follow</h3><ul>${soc}</ul></div>
          </div>
          <div class="footer-bottom"><span>© ${new Date().getFullYear()} ${esc(S.name)}</span><span>Made with lots of ♡</span></div>
        </div>
      </footer>
      <aside class="drawer" id="cart" aria-label="Your bag" aria-hidden="true">
        <div class="drawer__head"><h2>Your bag</h2><button class="icon-btn" type="button" data-close-cart aria-label="Close bag">${ICON.close}</button></div>
        <div class="drawer__body" data-cart-items></div>
        <div class="drawer__foot" data-cart-foot></div>
      </aside>
      <div class="drawer-backdrop" data-close-cart></div>
      <div class="toast" role="status" aria-live="polite"></div>`);

    const header = $(".site-header");
    const onScroll = () => header.classList.toggle("is-scrolled", scrollY > 40);
    addEventListener("scroll", onScroll, { passive: true }); onScroll();

    const menuBtn = $(".menu-btn");
    menuBtn.addEventListener("click", () => {
      const open = $("#nav").classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", open);
      menuBtn.innerHTML = open ? ICON.close : ICON.menu;
    });
    $$("[data-open-cart]").forEach((b) => b.addEventListener("click", openCart));
    $$("[data-close-cart]").forEach((b) => b.addEventListener("click", closeCart));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeCart(); });
    themeTrail();
  }

  /* ---------- themed cursor trail, on every page while a style is on ---------- */
  const TRAIL = {
    coquette: { c: ["#f4a6c6", "#d6457f", "#fde2ec"], d: "M50 88C20 66 6 50 6 32 6 18 17 8 30 8c9 0 16 5 20 12 4-7 11-12 20-12 13 0 24 10 24 24 0 18-14 34-44 56z" },
    cottagecore: { c: ["#9db48a", "#e8a0a0", "#f0d27a"], d: "M50 50m-12 0a12 12 0 1 0 24 0a12 12 0 1 0-24 0M50 6a14 14 0 0 1 0 30a14 14 0 0 1 0-30M50 64a14 14 0 0 1 0 30a14 14 0 0 1 0-30M6 50a14 14 0 0 1 30 0a14 14 0 0 1-30 0M64 50a14 14 0 0 1 30 0a14 14 0 0 1-30 0" },
    y2k: { c: ["#ff5fc8", "#6fd6ff", "#c03fff", "#fff27a"], d: "M50 4c5 30 16 41 46 46-30 5-41 16-46 46-5-30-16-41-46-46 30-5 41-16 46-46z" },
    goth: { c: ["#8e1b3d", "#d2245a", "#6b5b7b"], d: "M62 6A44 44 0 1 0 94 70 34 34 0 1 1 62 6z" },
    cybersigilism: { c: ["#c7cfe0", "#ff2fb3", "#e8ebf2"], d: "M50 2l6 38 38-10-30 22 30 26-38-8-6 28-6-28-38 8 30-26L6 30l38 10z" },
  };
  function themeTrail() {
    if (reduceMotion || page === "home") return; // the homepage has its own sparkle trail
    let last = 0;
    addEventListener("pointermove", (e) => {
      const t = TRAIL[styleId()];
      if (!t || e.pointerType !== "mouse" || Date.now() - last < 70) return; last = Date.now();
      const s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      s.setAttribute("viewBox", "0 0 100 100"); s.setAttribute("class", "theme-trail"); s.setAttribute("aria-hidden", "true");
      s.innerHTML = `<path d="${t.d}" fill="${t.c[Math.floor(Math.random() * t.c.length)]}"/>`;
      s.style.left = e.clientX - 8 + "px"; s.style.top = e.clientY - 8 + "px";
      document.body.appendChild(s); setTimeout(() => s.remove(), 800);
    }, { passive: true });
  }

  /* ---------- Toast ---------- */
  let toastTimer;
  function toast(msg, icon = "heart", color = "pink") {
    const t = $(".toast");
    t.innerHTML = art(icon, color) + `<span>${esc(msg)}</span>`;
    t.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("is-on"), 2600);
  }

  /* ---------- Wishlist ---------- */
  const getWish = () => store.get("wish", []);
  function toggleWish(id, btn) {
    let w = getWish();
    const on = !w.includes(id);
    w = on ? w.concat(id) : w.filter((x) => x !== id);
    store.set("wish", w);
    if (btn) { btn.setAttribute("aria-pressed", on); btn.classList.remove("pop"); void btn.offsetWidth; btn.classList.add("pop"); }
    updateCounts();
    const p = productById(id);
    toast(on ? `Saved ${p.name}` : "Removed from saved", "heart", "pink");
  }

  /* ---------- Cart ---------- */
  // A bag line is either a product { id, qty, variant? } (variant = chosen colour)
  // or a journal kit { id: "kit-…", kit: [product ids], qty } built on the homepage.
  const KIT = Object.assign({ discount: 0.15, minPieces: 3 }, S.kit || {});
  const lineKey = (l) => (l.kit ? l.id : l.id + (l.variant ? "|" + l.variant : ""));
  function lineInfo(l) {
    if (l.kit) {
      const items = l.kit.map(productById);
      if (!items.length || items.some((p) => !p || p.soldOut)) return null;
      const full = items.reduce((n, p) => n + p.price, 0);
      const off = items.length >= KIT.minPieces ? KIT.discount : 0;
      return { name: `Journal kit (${items.length} pieces)`, detail: items.map((p) => p.name).join(", "), price: Math.round(full * (1 - off) * 100) / 100, full, icon: "notebook", color: "pink", href: "index.html#kit" };
    }
    const p = productById(l.id);
    if (!p) return null;
    return { name: p.name + (l.variant ? ` (${l.variant})` : ""), price: p.price, icon: p.icon, color: p.color, image: p.image, href: `product.html?id=${p.id}` };
  }
  const getCart = () => store.get("cart", []).filter((l) => lineInfo(l));
  const setCart = (c) => { store.set("cart", c); updateCounts(); renderCart(); };
  const cartCount = () => getCart().reduce((n, l) => n + l.qty, 0);
  const cartTotal = () => getCart().reduce((n, l) => n + lineInfo(l).price * l.qty, 0);

  function bagWiggle() { const bag = $("[data-open-cart]"); bag.classList.remove("wiggle"); void bag.offsetWidth; bag.classList.add("wiggle"); }
  function addToCart(id, qty = 1, variant = "", quiet = false) {
    const p = productById(id);
    if (!p || p.soldOut) return;
    const c = getCart();
    const line = c.find((l) => !l.kit && l.id === id && (l.variant || "") === variant);
    line ? (line.qty += qty) : c.push(variant ? { id, qty, variant } : { id, qty });
    setCart(c);
    bagWiggle();
    if (!quiet) toast(`${p.name}${variant ? ` (${variant})` : ""} is in your bag`, p.icon, p.color);
  }
  function addKitToCart(ids) {
    const items = ids.filter((id) => { const p = productById(id); return p && !p.soldOut; });
    if (!items.length) return null;
    const c = getCart();
    const line = { id: "kit-" + Date.now().toString(36), kit: items, qty: 1 };
    c.push(line); setCart(c); bagWiggle();
    return lineInfo(line);
  }
  function changeQty(key, delta) {
    const c = getCart();
    const line = c.find((l) => lineKey(l) === key);
    if (!line) return;
    line.qty += delta;
    setCart(c.filter((l) => l.qty > 0));
  }

  function shipMeter(total) {
    const left = S.freeShippingOver - total;
    const pct = Math.min(100, (total / S.freeShippingOver) * 100);
    const msg = left > 0 ? `You're ${money(left)} away from free shipping` : "Yay, your shipping is free";
    return `<div class="ship-meter">${msg}<div class="ship-meter__bar"><div class="ship-meter__fill" style="width:${pct}%"></div></div></div>`;
  }

  function renderCart() {
    const box = $("[data-cart-items]");
    if (!box) return;
    const c = getCart();
    if (!c.length) {
      box.innerHTML = `<div class="empty">${art("apple", "apple")}<h3>Your bag is empty</h3><p class="muted">Find something sweet to fill it.</p><a class="btn btn--small" href="shop.html">Browse the shop</a></div>`;
      $("[data-cart-foot]").innerHTML = "";
      return;
    }
    box.innerHTML = c.map((l) => {
      const p = lineInfo(l), k = esc(lineKey(l));
      return `<div class="line-item">
        <div class="line-item__art c-${p.color}">${p.image ? `<img src="${esc(p.image)}" alt="">` : art(p.icon, p.color)}</div>
        <div><a class="line-item__name" href="${p.href}">${esc(p.name)}</a>${p.detail ? `<div class="muted" style="font-size:.85rem">${esc(p.detail)}</div>` : ""}<div class="muted">${p.full && p.full !== p.price ? `<s>${money(p.full)}</s> ` : ""}${money(p.price)}</div>
          <button class="line-item__remove" type="button" data-remove="${k}">Remove</button></div>
        <div class="qty"><button type="button" data-dec="${k}" aria-label="One less">−</button><span>${l.qty}</span><button type="button" data-inc="${k}" aria-label="One more">+</button></div>
      </div>`;
    }).join("");
    $("[data-cart-foot]").innerHTML = `${shipMeter(cartTotal())}
      <div class="summary-row summary-row--total" style="border:0;margin:0;padding-top:0"><span>Subtotal</span><span>${money(cartTotal())}</span></div>
      <a class="btn btn--teal" style="width:100%;margin-top:.8rem" href="checkout.html">Check out</a>`;
    $$("[data-inc]", box).forEach((b) => b.addEventListener("click", () => changeQty(b.dataset.inc, 1)));
    $$("[data-dec]", box).forEach((b) => b.addEventListener("click", () => changeQty(b.dataset.dec, -1)));
    $$("[data-remove]", box).forEach((b) => b.addEventListener("click", () => changeQty(b.dataset.remove, -999)));
  }

  let lastFocus;
  function openCart() {
    lastFocus = document.activeElement;
    renderCart();
    const d = $("#cart");
    d.classList.add("is-open"); d.setAttribute("aria-hidden", "false");
    $(".drawer-backdrop").classList.add("is-open");
    $("[data-close-cart]", d).focus();
  }
  function closeCart() {
    const d = $("#cart");
    if (!d || !d.classList.contains("is-open")) return;
    d.classList.remove("is-open"); d.setAttribute("aria-hidden", "true");
    $(".drawer-backdrop").classList.remove("is-open");
    if (lastFocus) lastFocus.focus();
  }

  function updateCounts() {
    const cc = cartCount(), wc = getWish().length;
    $$("[data-cart-count]").forEach((e) => (e.textContent = cc || ""));
    $$("[data-wish-count]").forEach((e) => (e.textContent = wc || ""));
  }

  /* ---------- Product card ---------- */
  function productCard(p) {
    const wished = getWish().includes(p.id);
    const tag = p.soldOut ? `<span class="product__tag product__tag--out">Sold out</span>` : p.badge ? `<span class="product__tag">${esc(p.badge)}</span>` : "";
    return `<article class="product c-${p.color}">
      <a class="product__art" href="product.html?id=${p.id}" aria-label="${esc(p.name)}">${p.image ? `<img src="${esc(p.image)}" alt="${esc(p.name)}">` : art(p.icon, p.color)}${tag}</a>
      <button class="heart-btn" type="button" data-wish="${p.id}" aria-pressed="${wished}" aria-label="Save ${esc(p.name)}">${ICON.heart}</button>
      <div class="product__body"><a class="product__name" href="product.html?id=${p.id}">${esc(p.name)}</a><span class="product__price">${money(p.price)}</span></div>
      <button class="btn btn--small btn--plain product__add" type="button" data-add="${p.id}" ${p.soldOut ? "disabled" : ""}>${p.soldOut ? "Sold out" : "Add to bag"}</button>
    </article>`;
  }
  function bindCards(root = document) {
    $$("[data-add]", root).forEach((b) => b.addEventListener("click", () => addToCart(b.dataset.add)));
    $$("[data-wish]", root).forEach((b) => b.addEventListener("click", () => toggleWish(b.dataset.wish, b)));
  }

  /* ---------- Dates ---------- */
  const fmtDate = (d, opts = { day: "numeric", month: "long", year: "numeric" }) => new Date(d).toLocaleDateString("en-GB", opts);
  const upcoming = () => S.events.filter((e) => new Date(e.date) > new Date()).sort((a, b) => new Date(a.date) - new Date(b.date));

  function startCountdown(el, date) {
    const tick = () => {
      let s = Math.max(0, Math.floor((new Date(date) - new Date()) / 1000));
      const parts = [["days", 86400], ["hours", 3600], ["mins", 60], ["secs", 1]].map(([label, n]) => { const v = Math.floor(s / n); s -= v * n; return [label, v]; });
      el.innerHTML = parts.map(([l, v]) => `<div><b>${String(v).padStart(2, "0")}</b><small>${l}</small></div>`).join("");
    };
    tick(); setInterval(tick, 1000);
  }

  function eventFeature(e) {
    return `<div class="event-feature c-${e.color}">
      ${art(e.icon, e.color, "event-feature__icon")}
      <div><p>Next up · ${fmtDate(e.date, { weekday: "long", day: "numeric", month: "long" })}</p><h2>${esc(e.title)}</h2><p>${esc(e.place)}</p></div>
      <div><div class="countdown" data-countdown aria-label="Time until the event"></div></div>
    </div>`;
  }

  /* ---------- Journal helpers ---------- */
  const extraComments = (id) => (ONLINE ? [] : store.get("comments_" + id, []));
  const allComments = (post) => post.comments.concat(extraComments(post.id));
  const likedPosts = () => store.get("liked", []);
  function likeBtn(post) {
    const on = likedPosts().includes(post.id);
    return `<button class="chip-btn" type="button" data-like="${post.id}" aria-pressed="${on}">${ICON.heart}<span>${post.likes + (on ? 1 : 0)}</span><span class="sr-only">likes</span></button>`;
  }
  function bindLikes(root = document) {
    $$("[data-like]", root).forEach((b) => b.addEventListener("click", () => {
      const id = b.dataset.like, post = S.journal.find((p) => p.id === id);
      let l = likedPosts(); const on = !l.includes(id);
      l = on ? l.concat(id) : l.filter((x) => x !== id); store.set("liked", l);
      b.setAttribute("aria-pressed", on); b.querySelector("span").textContent = post.likes + (on ? 1 : 0);
      if (ONLINE) sb.rpc("like_post", { p_id: id, p_add: on }).then(({ data }) => { if (typeof data === "number") post.likes = data - (on ? 1 : 0); });
      b.classList.remove("pop"); void b.offsetWidth; b.classList.add("pop");
    }));
  }
  const avatar = (name, color) => `<span class="avatar c-${color}" aria-hidden="true">${esc(name[0])}</span>`;

  /* =========================================================
     PAGES
     ========================================================= */
  const PAGES = {
    // The homepage lives in js/home.js

    // The shop and product pages live in js/shop.js

    events() {
      const next = upcoming()[0];
      if (next) { $("[data-next-event]").innerHTML = eventFeature(next); startCountdown($("[data-countdown]"), next.date); }
      const sorted = S.events.slice().sort((a, b) => new Date(a.date) - new Date(b.date));
      $("[data-events]").innerHTML = sorted.map((e) => {
        const d = new Date(e.date), past = d < new Date();
        const cal = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(e.title)}&details=${encodeURIComponent(e.text)}&location=${encodeURIComponent(e.place)}&dates=${d.toISOString().replace(/[-:]|\.\d{3}/g, "")}/${new Date(d.getTime() + 3 * 3600e3).toISOString().replace(/[-:]|\.\d{3}/g, "")}`;
        return `<article class="event c-${e.color} ${past ? "is-past" : ""}">
          <div class="event__date"><b>${d.getDate()}</b><span>${d.toLocaleDateString("en-GB", { month: "short" })}</span></div>
          <div><div class="event__meta"><span class="event__type">${esc(e.type)}</span>${d.toLocaleDateString("en-GB", { weekday: "long" })}, ${d.toLocaleTimeString("en-GB", { hour: "numeric", minute: "2-digit" })} to ${esc(e.end)} · ${esc(e.place)}</div>
            <h3>${esc(e.title)}</h3><p>${esc(e.text)}</p></div>
          ${past ? `<span class="muted" style="font-weight:800">This one's over</span>` : `<a class="btn btn--small btn--plain" href="${cal}" target="_blank" rel="noopener">Add to calendar</a>`}
        </article>`;
      }).join("");
    },

    journal() {
      // ---------- Digital scrapbook: flip through the posts like a real book ----------
      const root = $("[data-journal-root]");
      const posts = S.journal;
      const single = matchMedia("(max-width: 760px)");
      const tilt = (i, base = 3) => ((i % 2 ? 1 : -1) * (base + (i % 3))).toFixed(1);
      const noteColors = ["butter", "blush", "mint", "teal"];
      const shortDate = (d) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

      const notesHTML = (p) => {
        const list = allComments(p);
        return list.length
          ? list.map((c, i) => `<div class="sb-note c-${noteColors[i % 4]}" style="rotate:${tilt(i, 1.5)}deg"><p>${esc(c.text)}</p><b>${esc(c.name)}</b></div>`).join("")
          : `<p class="sb-hand sb-empty">No notes yet. Be the first to stick one on!</p>`;
      };

      const PAGES = {
        cover: () => `<div class="sb-page sb-cover">
            <div class="sb-cover__label">
              <img src="images/logo.webp" alt="${esc(S.name)}">
              <h1>Our scrapbook</h1>
              <p>Spreads, letters and little stories from our kitchen table.</p>
            </div>
            ${art("heart", "pink", "sb-deco").replace("<svg", '<svg style="width:17%;left:9%;top:8%;rotate:-14deg"')}
            ${art("star", "butter", "sb-deco").replace("<svg", '<svg style="width:15%;right:10%;top:12%;rotate:12deg"')}
            ${art("flower", "blush", "sb-deco").replace("<svg", '<svg style="width:16%;right:12%;bottom:9%;rotate:-8deg"')}
            <button class="btn sb-open" type="button" data-sb-next>Open the scrapbook</button>
          </div>`,
        left: (p, i) => `<div class="sb-page sb-left sb-dots c-${p.color}">
            <span class="sb-stamp">${shortDate(p.date)}</span>
            <figure class="sb-polaroid" style="rotate:${tilt(i)}deg">
              <span class="sb-tape sb-tape--a"></span><span class="sb-tape sb-tape--b"></span>
              <div class="sb-polaroid__img">${p.image ? `<img src="${esc(p.image)}" alt="">` : art(p.icon, p.color)}</div>
              <figcaption class="sb-hand">by ${esc(p.author)} ♡</figcaption>
            </figure>
            ${art("sparkle", "butter", "sb-deco").replace("<svg", `<svg style="width:12%;right:8%;top:24%;rotate:${tilt(i + 1, 8)}deg"`)}
            <h3 class="sb-hand sb-notes-title">Notes from friends</h3>
            <div class="sb-notes" data-sb-notes="${p.id}">${notesHTML(p)}</div>
            <span class="sb-pageno">${i * 2 + 1}</span>
          </div>`,
        right: (p, i) => `<div class="sb-page sb-right sb-lined">
            <div class="sb-labels">${p.tags.map((t) => `<span>${esc(t)}</span>`).join("")}</div>
            <h2>${esc(p.title)}</h2>
            <p class="sb-meta">${fmtDate(p.date)} · written by ${esc(p.author)}</p>
            <div class="sb-body">${p.body.map((b) => `<p>${esc(b)}</p>`).join("")}</div>
            <div class="feed-actions">${likeBtn(p)}<span class="muted" style="font-weight:700">${plural(allComments(p).length, "note")}</span></div>
            <form class="sb-form c-blush" data-sb-form="${p.id}">
              <span class="sb-tape sb-tape--a"></span>
              <b class="sb-hand">Leave a note</b>
              <label class="sr-only" for="n-${p.id}">Your name</label>
              <input id="n-${p.id}" name="name" placeholder="Your name" required maxlength="40">
              <label class="sr-only" for="t-${p.id}">Your note</label>
              <textarea id="t-${p.id}" name="text" placeholder="Write something kind…" required maxlength="300"></textarea>
              <button class="btn btn--small" type="submit">Stick it on</button>
            </form>
            <span class="sb-pageno">${i * 2 + 2}</span>
          </div>`,
        end: () => `<div class="sb-page sb-left sb-dots sb-end">
            ${art("envelope", "mint", "sb-end__art")}
            <h2>That's the last page, for now</h2>
            <p>We add a new spread every month. Join the pen-pal list and we'll tell you when it's ready.</p>
            <div class="hero__ctas" style="justify-content:center"><button class="btn btn--plain" type="button" data-sb-go="0">Back to the cover</button><a class="btn" href="shop.html">Visit the shop</a></div>
          </div>`,
        back: () => `<div class="sb-page sb-cover sb-backcover"><img src="images/logo.webp" alt=""></div>`,
        blank: () => `<div class="sb-page sb-blank"></div>`,
      };

      // Pages in reading order: cover, then left + right for each post, then the end page
      const order = [PAGES.cover()].concat(...posts.map((p, i) => [PAGES.left(p, i), PAGES.right(p, i)]), [PAGES.end()]);

      root.innerHTML = `
        <div class="page-hero sb-hero"><h1>The journal</h1><p>Flip through our scrapbook. Click a page corner, use the arrow keys, or swipe.</p></div>
        <div class="sb-tabs" data-sb-tabs role="group" aria-label="Jump to a page"></div>
        <div class="sb-stage" data-sb-stage><div class="book" data-book></div></div>
        <div class="sb-controls">
          <button class="btn btn--plain btn--small" type="button" data-sb-prev>Back</button>
          <span class="sb-status" data-sb-status aria-live="polite"></span>
          <button class="btn btn--small" type="button" data-sb-next-btn>Next</button>
        </div>`;

      const book = $("[data-book]");
      let leaves = [], flipped = 0, max = 0, isSingle = false;

      // Which post (1-based) is showing, or 0 for cover / posts.length + 1 for the end
      const currentPost = () => isSingle ? (flipped === 0 ? 0 : Math.ceil(flipped / 2)) : flipped;
      const indexForPost = (n) => isSingle ? (n === 0 ? 0 : n * 2 - 1) : n;

      function build(startPost) {
        isSingle = single.matches;
        book.classList.toggle("book--single", isSingle);
        let pairs;
        if (isSingle) pairs = order.map((pg) => [pg, PAGES.blank()]);
        else { pairs = []; for (let i = 0; i < order.length; i += 2) pairs.push([order[i], order[i + 1] || PAGES.blank()]); }
        book.innerHTML = (isSingle ? "" : `<div class="book__under">${PAGES.back()}</div>`) + pairs.map(([front, back], i) => `
          <div class="leaf" data-leaf="${i}">
            <div class="face face--front">${front}${(isSingle ? i < pairs.length - 1 : true) ? `<button class="sb-corner sb-corner--next" type="button" data-sb-next aria-label="Next page"></button>` : ""}</div>
            <div class="face face--back">${back}<button class="sb-corner sb-corner--prev" type="button" data-sb-prev-corner aria-label="Previous page"></button></div>
          </div>`).join("");
        leaves = $$(".leaf", book);
        max = isSingle ? leaves.length - 1 : leaves.length;
        bindPage();
        go(indexForPost(startPost), true);
      }

      function setZ() {
        leaves.forEach((l, i) => { l.style.zIndex = i < flipped ? i + 1 : leaves.length - i + 1; });
      }

      function refresh() {
        leaves.forEach((l, i) => {
          const front = $(".face--front", l), back = $(".face--back", l);
          const showFront = i === flipped;
          const showBack = !isSingle && i === flipped - 1;
          front.inert = !showFront; back.inert = !showBack;
        });
        book.classList.toggle("is-closed", !isSingle && flipped === 0);
        $("[data-sb-prev]").disabled = flipped === 0;
        $("[data-sb-next-btn]").disabled = flipped >= max;
        const n = currentPost();
        $("[data-sb-status]").textContent = n === 0 ? "Cover" : n > posts.length ? "The end" : `Post ${n} of ${posts.length}`;
        $$("[data-sb-tab]").forEach((t) => t.setAttribute("aria-current", Number(t.dataset.sbTab) === n));
        const p = posts[n - 1];
        history.replaceState(null, "", p ? `journal.html?post=${p.id}` : "journal.html");
        document.title = p ? `${p.title} | ${S.name}` : `Journal | ${S.name}`;
      }

      function go(target, instant = false) {
        target = Math.max(0, Math.min(max, target));
        if (target === flipped && !instant) return;
        const forward = target > flipped;
        const todo = [];
        if (forward) for (let i = flipped; i < target; i++) todo.push(i);
        else for (let i = flipped - 1; i >= target; i--) todo.push(i);
        const prev = flipped; flipped = target;
        if (instant || reduceMotion) {
          book.classList.add("no-anim");
          leaves.forEach((l, i) => l.classList.toggle("is-flipped", i < flipped));
          setZ(); void book.offsetWidth; book.classList.remove("no-anim");
        } else {
          const gap = Math.min(160, 600 / Math.max(1, todo.length));
          todo.forEach((i, k) => setTimeout(() => {
            leaves[i].style.zIndex = 1000 + k;
            leaves[i].classList.toggle("is-flipped", forward);
          }, k * gap));
          clearTimeout(go.t); go.t = setTimeout(setZ, todo.length * gap + 950);
        }
        if (prev !== flipped || instant) refresh();
      }
      const next = () => go(flipped + 1);
      const prev = () => go(flipped - 1);

      function bindPage() {
        $$("[data-sb-next]", book).forEach((b) => b.addEventListener("click", next));
        $$("[data-sb-prev-corner]", book).forEach((b) => b.addEventListener("click", prev));
        $$("[data-sb-go]", book).forEach((b) => b.addEventListener("click", () => go(Number(b.dataset.sbGo))));
        bindLikes(book);
        $$("[data-sb-form]", book).forEach((f) => f.addEventListener("submit", async (e) => {
          e.preventDefault();
          const id = f.dataset.sbForm, p = posts.find((x) => x.id === id);
          const c = { name: f.name.value.trim(), text: f.text.value.trim(), date: new Date().toISOString() };
          if (!c.name || !c.text) return;
          if (ONLINE) {
            const btn = f.querySelector("button"); btn.disabled = true;
            const { error } = await sb.from("comments").insert({ post_id: id, name: c.name, body: c.text });
            btn.disabled = false;
            if (error) { toast("Your note couldn't be saved. Please try again.", "cloud", "teal"); return; }
            p.comments.push(c);
          } else store.set("comments_" + id, extraComments(id).concat(c));
          f.reset();
          $$(`[data-sb-notes="${id}"]`, book).forEach((box) => { box.innerHTML = notesHTML(p); box.lastElementChild?.classList.add("is-new"); });
          toast("Your note is stuck on", "heart", "pink");
          if (isSingle) go(flipped - 1); // on phones, flip back so they can see their note
        }));
      }

      // Washi-tape tabs to jump straight to a post
      const tabs = [["0", "Cover", "teal"]].concat(posts.map((p, i) => [String(i + 1), p.title, p.color]), [[String(posts.length + 1), "The end", "butter"]]);
      $("[data-sb-tabs]").innerHTML = tabs.map(([n, label, color], i) => `<button class="sb-tab c-${color}" type="button" data-sb-tab="${n}" style="rotate:${tilt(i, 1)}deg">${esc(label)}</button>`).join("");
      $$("[data-sb-tab]").forEach((t) => t.addEventListener("click", () => {
        const n = Number(t.dataset.sbTab);
        go(n > posts.length ? max : indexForPost(n));
      }));

      $("[data-sb-prev]").addEventListener("click", prev);
      $("[data-sb-next-btn]").addEventListener("click", next);
      document.addEventListener("keydown", (e) => {
        if (e.target.closest("input, textarea, select")) return;
        if (e.key === "ArrowRight") next();
        if (e.key === "ArrowLeft") prev();
      });
      // Swipe on touch screens
      let sx = null;
      const stage = $("[data-sb-stage]");
      stage.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse" && !e.target.closest("input, textarea, button, a")) sx = e.clientX; });
      stage.addEventListener("pointerup", (e) => { if (sx === null) return; const dx = e.clientX - sx; sx = null; if (Math.abs(dx) > 50) (dx < 0 ? next : prev)(); });

      // Rebuild when switching between phone (one page) and desktop (two pages)
      single.addEventListener("change", () => build(currentPost()));

      const startId = params.get("post");
      const startIdx = posts.findIndex((p) => p.id === startId);
      build(startIdx >= 0 ? startIdx + 1 : 0);
    },

    // "Our story" lives in js/story.js

    checkout() {
      const box = $("[data-summary]"), form = $("[data-checkout-form]");
      const draw = () => {
        const c = getCart();
        if (!c.length) {
          $("[data-checkout]").innerHTML = `<div class="empty" style="grid-column:1/-1">${art("apple", "apple")}<h2>Your bag is empty</h2><p class="muted" style="margin-inline:auto">Add something to your bag, then come back here to check out.</p><a class="btn" href="shop.html">Browse the shop</a></div>`;
          return false;
        }
        const sub = cartTotal(), ship = sub >= S.freeShippingOver ? 0 : S.shippingCost;
        box.innerHTML = `<h2 style="font-size:1.6rem">Your order</h2>
          ${c.map((l) => { const p = lineInfo(l); return `<div class="summary-row"><span>${l.qty} × ${esc(p.name)}${p.detail ? `<br><small class="muted">${esc(p.detail)}</small>` : ""}</span><span>${money(p.price * l.qty)}</span></div>`; }).join("")}
          <div class="summary-row" style="border-top:2px dashed var(--line);margin-top:.5rem;padding-top:.8rem"><span>Subtotal</span><span>${money(sub)}</span></div>
          <div class="summary-row"><span>Shipping</span><span>${ship ? money(ship) : "Free"}</span></div>
          <div class="summary-row summary-row--total"><span>Total</span><span>${money(sub + ship)}</span></div>
          ${shipMeter(sub)}`;
        return { sub, ship };
      };
      const CARD = ONLINE && CFG.cardPayments === true; // card payments switched on in js/config.js?
      if (CARD && params.get("paid")) {
        store.set("cart", []); updateCounts();
        $("[data-checkout]").innerHTML = `<div class="empty" style="grid-column:1/-1">${art("heart", "pink")}<h2>Thank you, your order is in!</h2><p class="muted" style="margin-inline:auto">Your order number is <b>#${esc(params.get("order") || "")}</b>. A receipt is on its way to your email, and we'll pop your parcel in the post soon.</p><div class="hero__ctas" style="justify-content:center">${currentUser ? '<a class="btn btn--plain" href="account.html">See my orders</a>' : ""}<a class="btn" href="index.html">Back to home</a></div></div>`;
        return;
      }
      if (!draw()) return;
      if (ONLINE) {
        if (CARD) $("[data-checkout-submit]").textContent = "Pay securely with card";
        if (params.get("cancelled")) toast("Payment cancelled. Your bag is still here.", "cloud", "teal");
        if (currentUser) {
          sb.from("profiles").select("full_name, address").eq("id", currentUser.id).maybeSingle().then(({ data }) => {
            if (!form.name.value) form.name.value = data?.full_name || "";
            if (!form.email.value) form.email.value = currentUser.email || "";
            if (!form.address.value) form.address.value = data?.address || "";
          });
        } else {
          form.insertAdjacentHTML("afterbegin", `<p class="muted" style="margin:0">Checking out as a guest. <a class="link" href="account.html?next=checkout">Log in</a> to save this order to your account.</p>`);
        }
      }
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (CARD) {
          const btn = $("[data-checkout-submit]"), label = btn.textContent;
          btn.disabled = true; btn.textContent = "Opening secure payment…";
          const d = Object.fromEntries(new FormData(form));
          const { data, error } = await sb.functions.invoke("create-checkout", { body: { items: getCart(), customer: d } });
          let msg = data?.error;
          if (error) { try { msg = (await error.context.json()).error; } catch { /* keep default */ } }
          if (data?.url) { location.href = data.url; return; }
          btn.disabled = false; btn.textContent = label;
          toast(msg || "We couldn't start the payment. Please try again.", "cloud", "teal");
          return;
        }
        const t = draw(), d = Object.fromEntries(new FormData(form));
        const lines = getCart().map((l) => { const p = lineInfo(l); return `- ${l.qty} x ${p.name}${p.detail ? `: ${p.detail}` : ""} (${money(p.price * l.qty)})`; }).join("\n");
        const msg = `Hello ${S.name}! I'd like to order:\n\n${lines}\n\nSubtotal: ${money(t.sub)}\nShipping: ${t.ship ? money(t.ship) : "Free"}\nTotal: ${money(t.sub + t.ship)}\n\nName: ${d.name}\nEmail: ${d.email}\nAddress: ${d.address}\nNote: ${d.note || "-"}`;
        const url = S.checkout.method === "whatsapp"
          ? `https://wa.me/${S.checkout.whatsapp}?text=${encodeURIComponent(msg)}`
          : `mailto:${S.checkout.email}?subject=${encodeURIComponent("New order from " + d.name)}&body=${encodeURIComponent(msg)}`;
        window.open(url, "_blank");
        $("[data-checkout]").innerHTML = `<div class="empty" style="grid-column:1/-1">${art("heart", "pink")}<h2>Thank you, ${esc(d.name)}!</h2><p class="muted" style="margin-inline:auto">Your order message is ready to send. Once we get it, we'll reply with payment details and pop your parcel in the post.</p><a class="btn" href="index.html">Back to home</a></div>`;
        store.set("cart", []); updateCounts();
      });
    },

    brand() {
      const vars = getComputedStyle(document.documentElement);
      const sw = [["Blush paper", "--paper", "Page background"], ["Navy ink", "--ink", "Text and outlines"], ["Apple teal", "--teal", "Main brand colour"], ["Bubblegum", "--pink", "Buttons and hearts"], ["Butter", "--butter", "Highlights"], ["Apple red", "--apple", "Small accents only"], ["Mint", "--mint", "Soft backgrounds"], ["Blush", "--blush", "Soft backgrounds"]];
      $("[data-swatches]").innerHTML = sw.map(([n, v, use]) => { const hex = vars.getPropertyValue(v).trim(); return `<button class="swatch" type="button" data-copy="${hex}"><div class="swatch__chip" style="background:${hex}"></div><div class="swatch__info"><b>${n}</b><code>${hex}</code><div class="muted" style="font-size:.85rem">${use}</div></div></button>`; }).join("");
      $$("[data-copy]").forEach((b) => b.addEventListener("click", () => { navigator.clipboard?.writeText(b.dataset.copy); toast(`Copied ${b.dataset.copy}`, "sparkle", "butter"); }));
      $("[data-logos]").innerHTML = `<div style="background:var(--paper)">${logo()}</div><div style="background:var(--teal)">${logo()}</div><div style="background:var(--ink)">${logo().replace("<a ", '<a style="color:#fff" ')}</div>`;
      $("[data-shelf]").innerHTML = Object.keys(DRAW).map((k, i) => `<figure>${art(k, ["apple", "pink", "butter", "teal", "blush", "mint", "teal", "apple", "teal", "butter"][i])}<figcaption>${k}</figcaption></figure>`).join("");
    },
  };

  function bindNewsletter() {
    const f = $("[data-newsletter]");
    if (!f) return;
    f.addEventListener("submit", (e) => { e.preventDefault(); f.innerHTML = `<p style="font-weight:800">You're on the list! Check your inbox for your 10% code.</p>`; toast("Welcome to the pen-pal list", "envelope", "mint"); });
  }

  /* ---------- Database (only when switched on in js/config.js) ---------- */
  const loadScript = (src) => new Promise((ok, fail) => { const s = document.createElement("script"); s.src = src; s.onload = ok; s.onerror = fail; document.head.appendChild(s); });

  async function connect() {
    if (!window.supabase) await loadScript("js/vendor/supabase.js");
    sb = window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseAnonKey);
    const [{ data: sess }, products, posts] = await Promise.all([
      sb.auth.getSession(),
      sb.from("products").select("*").order("sort").order("name"),
      sb.from("posts").select("*, comments(name, body, created_at)").order("date", { ascending: false }),
    ]);
    currentUser = sess?.session?.user || null;
    if (currentUser) { const { data } = await sb.rpc("is_admin"); isAdmin = data === true; }
    if (currentUser && !styleId()) { // a style picked on another device follows the account
      const { data } = await sb.from("profiles").select("style").eq("id", currentUser.id).maybeSingle();
      if (data && data.style && window.SA_setStyle) { window.SA_setStyle(data.style); const chip = styleChip(); if (chip) $(".header-actions").insertAdjacentHTML("afterbegin", chip); }
    }
    if (products.error) throw products.error;
    const localStyles = Object.fromEntries(S.products.map((p) => [p.id, p.styles || []])); // used until the "styles" column exists
    if (posts.error) throw posts.error;
    S.products = products.data.map((p) => ({ id: p.id, name: p.name, price: Number(p.price), category: p.category, icon: p.icon, color: p.color, badge: p.badge || "", isNew: p.is_new, soldOut: p.sold_out, description: p.description || "", image: p.image || undefined, colors: Array.isArray(p.colors) ? p.colors : undefined,
      styles: Array.isArray(p.styles) ? p.styles : (localStyles[p.id] || []) }));
    const liked = likedPosts();
    S.journal = posts.data.map((p) => ({
      id: p.id, title: p.title, date: p.date, author: p.author, icon: p.icon, color: p.color, tags: p.tags || [], image: p.image || "",
      likes: Math.max(0, p.likes - (liked.includes(p.id) ? 1 : 0)),
      body: (p.body || "").split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean),
      comments: (p.comments || []).sort((a, b) => new Date(a.created_at) - new Date(b.created_at)).map((c) => ({ name: c.name, text: c.body, date: c.created_at })),
    }));
  }

  /* ---------- Go ---------- */
  const SA = { S, $, $$, esc, money, art, toast, fmtDate, plural, ICON, store, params, updateCounts,
    addToCart, addKitToCart, openCart, productById, catById, allComments, upcoming, KIT,
    getWish, toggleWish, styleId, styleInfo, TRAIL,
    get sb() { return sb; }, get user() { return currentUser; }, get isAdmin() { return isAdmin; }, online: ONLINE };
  window.SA = SA;
  renderChrome();
  updateCounts();
  (async () => {
    if (ONLINE) {
      try {
        // give up after 5 seconds so a slow connection never leaves the page stuck
        await Promise.race([connect(), new Promise((_, no) => setTimeout(() => no(new Error("Database took too long")), 5000))]);
        updateCounts();
      }
      catch (e) { console.error("Database connection failed, showing built-in content instead.", e); }
    }
    const run = PAGES[page] || (window.SA_PAGES || {})[page];
    if (run) run(SA);
  })();
})();
