/* =========================================================
   SENTIMENTAL APPLE — HOMEPAGE (pink scrapbook)
   Words and pictures come from js/data.js (SITE.home, SITE.kit,
   SITE.banners, SITE.collections, SITE.categories, SITE.products).
   ========================================================= */
(function () {
  "use strict";

  const COLOR = { apple: "#e84a55", pink: "#f177ae", butter: "#ffe07d", teal: "#83c3c3", mint: "#83c3c3", blush: "#ffb3d2", navy: "#2e2460", deep: "#de4e93" };
  const CAT_ART = { stickers: "sheet", notebooks: "notebook", postcards: "postcard", prints: "print", journalling: "washi", bundles: "gift" };

  /* ---------- drawings (colour passed in so they also export to an image) ---------- */
  const face = (x, y, s = 1) => `<g fill="#2e2460"><circle cx="${x - 9 * s}" cy="${y}" r="${3.2 * s}"/><circle cx="${x + 9 * s}" cy="${y}" r="${3.2 * s}"/></g><ellipse cx="${x - 16 * s}" cy="${y + 7 * s}" rx="${4.5 * s}" ry="${2.8 * s}" fill="#fff" opacity=".55"/><ellipse cx="${x + 16 * s}" cy="${y + 7 * s}" rx="${4.5 * s}" ry="${2.8 * s}" fill="#fff" opacity=".55"/><path d="M${x - 4 * s} ${y + 6 * s} q${4 * s} ${4.5 * s} ${8 * s} 0" fill="none" stroke="#2e2460" stroke-width="${2.4 * s}" stroke-linecap="round"/>`;
  const mini = (name, c, x, y, w, rot = 0) => `<g transform="translate(${x} ${y}) rotate(${rot} ${w / 2} ${w / 2}) scale(${w / 100})">${DRAW[name](c)}</g>`;
  const DRAW = {
    heart: (c) => `<path d="M50 87C21 66 8 48 13 31c5-17 28-21 37-4 9-17 32-13 37 4 5 17-8 35-37 56z" fill="${c}"/><ellipse cx="29" cy="34" rx="5" ry="8" fill="#fff" opacity=".5" transform="rotate(35 29 34)"/>${face(50, 50)}`,
    apple: (c) => `<path d="M50 30C36 19 12 24 12 52c0 25 20 41 38 33 18 8 38-8 38-33 0-28-24-33-38-22z" fill="${c}"/><path d="M50 31c0-8 2-14 6-19" fill="none" stroke="#7a5236" stroke-width="5" stroke-linecap="round"/><path d="M56 19c6-10 18-12 24-8-4 9-14 13-24 8z" fill="#83c3c3"/>${face(50, 56)}`,
    star: (c) => `<polygon points="50,9 61,37 91,38 67,57 76,87 50,70 24,87 33,57 9,38 39,37" fill="${c}" stroke="${c}" stroke-width="9" stroke-linejoin="round"/>${face(50, 52, 0.9)}`,
    cloud: (c) => `<g fill="${c}"><circle cx="34" cy="58" r="20"/><circle cx="54" cy="44" r="25"/><circle cx="74" cy="60" r="17"/><rect x="22" y="56" width="62" height="22" rx="11"/></g>${face(52, 58, 0.9)}`,
    flower: (c) => `<g fill="${c}"><circle cx="50" cy="24" r="16"/><circle cx="75" cy="42" r="16"/><circle cx="66" cy="72" r="16"/><circle cx="34" cy="72" r="16"/><circle cx="25" cy="42" r="16"/></g><circle cx="50" cy="50" r="19" fill="#ffe07d"/>${face(50, 49, 0.7)}`,
    envelope: (c) => `<rect x="10" y="24" width="80" height="56" rx="10" fill="${c}"/><path d="M14 30l36 26 36-26" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><path d="M50 70c-7-5-11-9-9-13 1-3 6-4 9 0 3-4 8-3 9 0 2 4-2 8-9 13z" fill="#e84a55"/>`,
    notebook: (c) => `<rect x="20" y="8" width="62" height="84" rx="10" fill="${c}"/><rect x="20" y="8" width="14" height="84" rx="6" fill="#2e2460" opacity=".18"/><rect x="42" y="22" width="30" height="16" rx="5" fill="#fff"/><path d="M70 8v30l-6-5-6 5V8" fill="#e84a55"/>${face(56, 62, 0.75)}`,
    sheet: (c) => `<rect x="14" y="8" width="72" height="84" rx="8" fill="#fff" stroke="#e7dfee" stroke-width="2"/>${mini("heart", c, 20, 14, 30, -8)}${mini("star", "#ffe07d", 50, 16, 30, 10)}${mini("apple", "#e84a55", 20, 50, 30, 6)}${mini("cloud", "#83c3c3", 50, 52, 30, -6)}`,
    washi: (c) => `<g transform="translate(0 6)"><circle cx="34" cy="62" r="24" fill="${c}"/><circle cx="34" cy="62" r="24" fill="none" stroke="#fff" stroke-width="5" stroke-dasharray="6 6" opacity=".7"/><circle cx="34" cy="62" r="11" fill="#fdfbe0"/><circle cx="66" cy="44" r="24" fill="#83c3c3"/><circle cx="66" cy="44" r="24" fill="none" stroke="#fff" stroke-width="5" stroke-dasharray="3 7" opacity=".8"/><circle cx="66" cy="44" r="11" fill="#fdfbe0"/><path d="M58 64h28v10H58z" fill="${c}" opacity=".85"/></g>`,
    postcard: (c) => `<g transform="rotate(-8 50 50)"><rect x="12" y="24" width="74" height="52" rx="4" fill="#fff" stroke="#e7dfee" stroke-width="2"/><rect x="18" y="30" width="34" height="40" rx="3" fill="${c}"/><path d="M58 46h22M58 54h22M58 62h16" stroke="#cfc6dd" stroke-width="2.5" stroke-linecap="round"/><rect x="68" y="30" width="12" height="12" fill="#ffe07d"/></g>${mini("heart", "#fff", 22, 36, 26)}`,
    print: (c) => `<rect x="18" y="10" width="64" height="80" rx="3" fill="#fff" stroke="#2e2460" stroke-width="3"/><rect x="26" y="18" width="48" height="56" fill="${c}"/><g fill="none" stroke-width="7" stroke-linecap="round"><path d="M32 66a18 18 0 0 1 36 0" stroke="#e84a55"/><path d="M40 66a10 10 0 0 1 20 0" stroke="#ffe07d"/></g>`,
    gift: (c) => `<rect x="16" y="40" width="68" height="48" rx="6" fill="${c}"/><rect x="12" y="30" width="76" height="16" rx="5" fill="${c}" stroke="#fff" stroke-width="2" opacity=".95"/><rect x="45" y="30" width="10" height="58" fill="#fff"/><path d="M50 30C38 10 18 16 26 28c4 6 16 4 24 2zM50 30c12-20 32-14 24-2-4 6-16 4-24 2z" fill="#de4e93" stroke="#2e2460" stroke-width="2"/>`,
  };
  const svgArt = (name, c, cls = "") => `<svg class="${cls}" viewBox="0 0 100 100" aria-hidden="true">${(DRAW[name] || DRAW.heart)(c)}</svg>`;
  const productArt = (p, hex) => CAT_ART[p.category] || (DRAW[p.icon] ? p.icon : "heart");
  const productHex = (p) => (p.colors && p.colors[0] ? p.colors[0][0] : COLOR[p.color] || "#f177ae");

  /* ---------- ransom-note lettering ---------- */
  function ransom(text, seedN = 1) {
    const STY = [
      ["Shrikhand", 400, "#fff", "#de4e93", "normal"], ["Bodoni Moda", 400, "#2e2460", "#fff", "italic"], ["Hanken Grotesk", 800, "#83c3c3", "#2e2460", "normal"],
      ["Pixelify Sans", 600, "#f177ae", "#fff", "normal"], ["Abril Fatface", 400, "#fff", "#2e2460", "normal"], ["Hanken Grotesk", 800, "#2e2460", "#fcd6e7", "normal"],
      ["Shrikhand", 400, "#fcd6e7", "#2e2460", "normal"], ["Bodoni Moda", 400, "#d6eeee", "#de4e93", "italic"]];
    let r = seedN * 97 + 13; const nx = () => (r = (r * 9301 + 49297) % 233280) / 233280;
    // letters are grouped per word so a word never breaks across two lines
    return text.split(" ").map((word) => `<b class="word">${[...word].map((ch) => {
      const [f, w, bg, col, st] = STY[Math.floor(nx() * STY.length)];
      const up = nx() < 0.55 ? ch.toUpperCase() : ch.toLowerCase();
      return `<span aria-hidden="true" style="font-family:'${f}';font-weight:${w};font-style:${st};background:${bg};color:${col};rotate:${(nx() * 12 - 6).toFixed(1)}deg;translate:0 ${(nx() * 6 - 3).toFixed(1)}px">${up.replace(/[&<>]/g, "")}</span>`;
    }).join("")}</b>`).join(`<span class="gap" aria-hidden="true"></span>`) + `<span class="sr-only">${text}</span>`;
  }

  const RIBBON = `<defs><linearGradient id="satin" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffd3e6"/><stop offset=".35" stop-color="#f08fbd"/><stop offset=".55" stop-color="#ffc6df"/><stop offset=".8" stop-color="#d9629b"/><stop offset="1" stop-color="#f6a9cb"/></linearGradient></defs>
    <path d="M100 62C78 22 22 6 12 36c-8 26 40 40 88 26z" fill="url(#satin)" stroke="#c23f80" stroke-width="2"/><path d="M100 62c22-40 78-56 88-26 8 26-40 40-88 26z" fill="url(#satin)" stroke="#c23f80" stroke-width="2"/>
    <path d="M94 66C80 100 60 128 34 150l18 2 6 14c22-28 38-60 44-96zM106 66c14 34 34 62 60 84l-18 2-6 14c-22-28-38-60-44-96z" fill="url(#satin)" stroke="#c23f80" stroke-width="2" stroke-linejoin="round"/>
    <ellipse cx="100" cy="64" rx="16" ry="14" fill="#f177ae" stroke="#c23f80" stroke-width="2"/>
    <path d="M30 30c14-10 34-8 50 6M126 36c16-12 36-14 50-4M48 128c10-12 24-34 32-52M150 128c-10-12-22-32-30-50" stroke="#fff" stroke-width="3" fill="none" opacity=".6" stroke-linecap="round"/>`;
  const SPARK = `<path d="M50 4c5 30 16 41 46 46-30 5-41 16-46 46-5-30-16-41-46-46 30-5 41-16 46-46z" fill="#fff" stroke="#ff9cc8" stroke-width="3"/>`;

  function phoneSVG() {
    const holes = Array.from({ length: 10 }, (_, k) => { const a = (-60 + k * 30) * Math.PI / 180; return `<circle cx="${(210 + 44 * Math.cos(a)).toFixed(1)}" cy="${(262 + 44 * Math.sin(a)).toFixed(1)}" r="9"/>`; }).join("");
    return `<defs><linearGradient id="ph" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9ecec"/><stop offset=".5" stop-color="#83c3c3"/><stop offset="1" stop-color="#5aa3a3"/></linearGradient>
      <linearGradient id="phs" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffd8ea"/><stop offset=".5" stop-color="#f6a9cb"/><stop offset="1" stop-color="#d9629b"/></linearGradient></defs>
      <path d="M30 330C40 240 70 190 110 180h200c40 10 70 60 80 150z" fill="url(#ph)" stroke="#2e2460" stroke-width="3"/>
      <rect x="22" y="320" width="376" height="30" rx="14" fill="#5aa3a3" stroke="#2e2460" stroke-width="3"/>
      <circle cx="210" cy="262" r="64" fill="#fff4f9" stroke="#2e2460" stroke-width="3"/>
      <g fill="#f6a9cb" stroke="#2e2460" stroke-width="2">${holes}</g>
      <circle cx="210" cy="262" r="20" fill="#f177ae" stroke="#2e2460" stroke-width="3"/>
      <path d="M70 160C60 110 90 80 130 92l22 34c-14 8-26 6-36 14l-20 4zM350 160c10-50-20-80-60-68l-22 34c14 8 26 6 36 14l20 4z" fill="url(#phs)" stroke="#2e2460" stroke-width="3" stroke-linejoin="round"/>
      <path d="M118 86C160 60 260 60 302 86l-8 22c-40-22-128-22-168 0z" fill="url(#phs)" stroke="#2e2460" stroke-width="3"/>
      <path d="M130 70c40-14 120-14 160 0" stroke="#fff" stroke-width="4" fill="none" opacity=".6" stroke-linecap="round"/>
      <path d="M392 330c20 0 22-20 10-24s-14 18 0 18 14-20 2-24-14 18 0 18" fill="none" stroke="#5aa3a3" stroke-width="4" stroke-linecap="round"/>`;
  }

  // shared with other scrapbook pages (e.g. Our story)
  window.SA_ART = { DRAW, svgArt, ransom, RIBBON, SPARK, COLOR };

  /* =========================================================
     HOMEPAGE
     ========================================================= */
  window.SA_PAGES = Object.assign(window.SA_PAGES || {}, {
    home(SA) {
      const { S, $, $$, esc, money, toast, productById, catById, addToCart, addKitToCart, KIT } = SA;
      const H = S.home || {};
      const main = $(".home");
      const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (H.pinkPhotos) main.classList.add("pink-photos");

      // little drawings used across the page
      const paint = () => $$("[data-art]", main).forEach((el) => { const [n, c] = el.dataset.art.split(":"); el.setAttribute("viewBox", "0 0 100 100"); el.innerHTML = DRAW[n](c); });

      /* ---------- 1. hero ---------- */
      const mine = SA.styleInfo(); // a style picked on style.html changes the little line above the title
      const kicker = mine ? `${mine.emoji} picked for your ${mine.name.toLowerCase()} era` : H.kicker;
      $("[data-kicker]").textContent = kicker || "";
      $("[data-kicker]").hidden = !kicker;
      $("[data-title]").textContent = H.title || S.tagline;
      $("[data-intro]").textContent = H.intro || "";


      /* ---------- 2. little promises ---------- */
      $("[data-perks]").innerHTML = (S.badges || []).map((b) => `<div class="perk"><img src="${esc(b.icon)}" alt=""><div><b>${esc(b.title)}</b><span>${esc(b.text)}</span></div></div>`).join("");
      if (!(S.badges || []).length) $(".hm-perks").remove();

      /* ---------- product card ---------- */
      function card(p) {
        const hex = productHex(p), label = p.soldOut ? "Sold out" : p.badge || (p.isNew ? "New" : "");
        return `<article class="hm-card" data-card="${esc(p.id)}">
          <a class="hm-card__pic" href="product.html?id=${esc(p.id)}" style="background:${hex}22" data-tile aria-label="${esc(p.name)}">
            ${label ? `<span class="hm-tag">${esc(label)}</span>` : ""}
            ${p.image ? `<img src="${esc(p.image)}" alt="">` : svgArt(productArt(p), hex, "sticker")}
          </a>
          <a class="hm-card__name" href="product.html?id=${esc(p.id)}">${esc(p.name)}</a>
          ${p.colors ? `<div class="hm-swatches" role="group" aria-label="Colour">${p.colors.map(([c, n], k) => `<button type="button" style="background:${c}" aria-label="${esc(n)}" aria-pressed="${k === 0}" data-sw="${k}"></button>`).join("")}<span data-swname>${esc(p.colors[0][1])}</span></div>` : ""}
          <div class="hm-card__row"><span class="price">${money(p.price)}</span><button class="add" type="button" data-add ${p.soldOut ? "disabled" : ""}>${p.soldOut ? "Sold out" : "Add to bag"}</button></div>
        </article>`;
      }
      function bindCards(root) {
        $$("[data-card]", root).forEach((el) => {
          const p = productById(el.dataset.card); let pick = 0;
          $$("[data-sw]", el).forEach((b) => b.addEventListener("click", () => {
            pick = +b.dataset.sw; const [c, n] = p.colors[pick];
            $$("[data-sw]", el).forEach((x) => x.setAttribute("aria-pressed", x === b));
            $("[data-swname]", el).textContent = n;
            const tile = $("[data-tile]", el); tile.style.background = c + "22";
            if (!p.image) tile.querySelector("svg").outerHTML = svgArt(productArt(p), c, "sticker");
          }));
          $("[data-add]", el).addEventListener("click", () => addToCart(p.id, 1, p.colors ? p.colors[pick][1] : ""));
        });
      }

      /* ---------- 3. our faves (with tabs) ---------- */
      {
        const pickFaves = (H.faves || []).map(productById).filter(Boolean);
        const TABS = [
          ["Our faves", pickFaves.length ? pickFaves : S.products.slice(0, 3)],
          ["New in", S.products.filter((p) => p.isNew)],
          ["Under £5", S.products.filter((p) => p.price < 5)],
        ].filter(([, list]) => list.length);
        const grid = $("[data-tab-grid]");
        const show = (i) => {
          $$("[data-tab]").forEach((b, k) => b.setAttribute("aria-pressed", k === i));
          grid.innerHTML = TABS[i][1].slice(0, 3).map(card).join(""); bindCards(grid);
        };
        $("[data-tabs]").innerHTML = TABS.map(([n], i) => `<button type="button" class="hm-tab" data-tab="${i}">${esc(n)}</button>`).join("");
        $$("[data-tab]").forEach((b) => b.addEventListener("click", () => show(+b.dataset.tab)));
        show(0);
        const col = (S.collections || []).find((c) => c.id === H.featureCollection) || (S.collections || [])[0];
        const feat = $("[data-feature]");
        if (col) { feat.href = `shop.html?col=${encodeURIComponent(col.id)}`; feat.innerHTML = `<img src="${esc(col.image)}" alt="${esc(col.name)}"><span class="pill pill--navy">Shop ${esc(col.name.toLowerCase())}</span>`; }
        else feat.remove();
      }

      /* ---------- 4. categories ---------- */
      $("[data-cats]").innerHTML = S.categories.map((c) => `
        <a class="hm-cat" href="shop.html?cat=${esc(c.id)}"><span class="hm-cat__pic" style="background:${COLOR[c.color] || "#f177ae"}2e">${svgArt(CAT_ART[c.id] || c.icon, COLOR[c.color] || "#f177ae", "sticker")}</span><b>${esc(c.name)}</b></a>`).join("");

      /* ---------- 2. banners ---------- */
      {
        const B = S.banners || [];
        const track = $("[data-track]"), dots = $("[data-bdots]");
        track.innerHTML = B.map((b, i) => `<a href="${esc(b.link)}" ${i ? 'tabindex="-1"' : ""}><img src="${esc(b.image)}" alt="${esc(b.alt)}" ${i ? 'loading="lazy"' : ""}></a>`).join("");
        dots.innerHTML = B.map((_, i) => `<button type="button" aria-label="Show banner ${i + 1}" data-bd="${i}"></button>`).join("");
        let i = 0, t;
        const go = (k) => {
          i = (k + B.length) % B.length; track.style.transform = `translateX(-${i * 100}%)`;
          $("[data-bcap]").textContent = B[i]?.caption || "";
          $$("a", track).forEach((a, j) => (a.tabIndex = j === i ? 0 : -1));
          $$("[data-bd]").forEach((d, j) => d.setAttribute("aria-current", j === i));
        };
        const auto = () => { clearInterval(t); if (!reduceMotion && B.length > 1) t = setInterval(() => go(i + 1), 5000); };
        $("[data-bprev]").addEventListener("click", () => { go(i - 1); auto(); });
        $("[data-bnext]").addEventListener("click", () => { go(i + 1); auto(); });
        $$("[data-bd]").forEach((d) => d.addEventListener("click", () => { go(+d.dataset.bd); auto(); }));
        $(".slides").addEventListener("mouseenter", () => clearInterval(t)); $(".slides").addEventListener("mouseleave", auto);
        if (B.length) { go(0); auto(); } else $(".hm-banners").remove();
      }


      /* ---------- 6. new arrivals ---------- */
      {
        const list = S.products.filter((p) => p.isNew).concat(S.products.filter((p) => !p.isNew)).slice(0, 4);
        const g = $("[data-new]"); g.innerHTML = list.map(card).join(""); bindCards(g);
      }

      /* ---------- 7. collections ---------- */
      $("[data-deck]").innerHTML = (S.collections || []).map((c) => `
        <a class="hm-col" href="shop.html?col=${esc(c.id)}"><img src="${esc(c.image)}" alt="${esc(c.name)}" loading="lazy"><span>${esc(c.note || c.name)}</span></a>`).join("");
      if (!(S.collections || []).length) $("[data-deck]").closest("section").remove();

      /* ---------- peel & move ---------- */
      const zoomOf = (el) => parseFloat(getComputedStyle(el).zoom) || 1;
      const pos = (el) => { const c = getComputedStyle(el); return [parseFloat(c.left) || 0, parseFloat(c.top) || 0]; };
      function makeDraggable(area, selector, canDrag = () => true) {
        let drag = null, topZ = 30;
        area.addEventListener("pointerdown", (e) => {
          const el = e.target.closest(selector); if (!el || !area.contains(el) || !canDrag(el)) return;
          e.preventDefault();
          const group = [el, ...(el.dataset.id ? $$(`[data-with="${el.dataset.id}"]`, area) : [])];
          drag = { el, x: e.clientX, y: e.clientY, z: zoomOf(area), start: group.map((g) => [g, ...pos(g)]) };
          topZ += 2; group.forEach((g, i) => (g.style.zIndex = topZ + i));
          el.classList.add("is-dragging"); el.setPointerCapture(e.pointerId);
        });
        area.addEventListener("pointermove", (e) => {
          if (!drag) return;
          const dx = (e.clientX - drag.x) / drag.z, dy = (e.clientY - drag.y) / drag.z;
          drag.start.forEach(([g, l, t]) => { g.style.left = l + dx + "px"; g.style.top = t + dy + "px"; });
        });
        const drop = () => { if (!drag) return; drag.el.classList.remove("is-dragging"); drag = null; };
        area.addEventListener("pointerup", drop); area.addEventListener("pointercancel", drop);
        area.addEventListener("keydown", (e) => {
          const el = e.target.closest(selector); if (!el || !canDrag(el)) return;
          const step = { ArrowLeft: [-12, 0], ArrowRight: [12, 0], ArrowUp: [0, -12], ArrowDown: [0, 12] }[e.key]; if (!step) return;
          e.preventDefault(); const [l, t] = pos(el); el.style.left = l + step[0] + "px"; el.style.top = t + step[1] + "px";
        });
      }
      /* ---------- 5. build your journal kit ---------- */
      {
        const pct = Math.round(KIT.discount * 100);
        $("[data-kit-sub]").textContent = `Drag your faves onto the page, doodle if you like, then add the whole kit to your bag. ${KIT.minPieces}+ pieces = ${pct}% off.`;
        const shelfItems = ((S.kit && S.kit.products) || []).map(productById).filter((p) => p && !p.soldOut).slice(0, 6);
        const paint = $("[data-paint]"), spread = $("[data-spread]"), drawSvg = $("[data-draw]");
        const PAL = ["#f177ae", "#de4e93", "#83c3c3", "#2e2460", "#fdfbe0", "#ffffff", "#fcd6e7", "#d6eeee", "#e84a55", "#ffe07d", "#5aa3a3", "#8c86ad", "#ffb3d2", "#b5dede", "#141414", "#c23f80"];
        let pen = "#de4e93", tool = "move";
        $("[data-palette]").innerHTML = PAL.map((c) => `<button type="button" style="background:${c}" aria-label="Colour ${c}" aria-pressed="${c === pen}" data-col="${c}"></button>`).join("");
        $("[data-well]").style.background = pen;
        const setTool = (t) => {
          if (t === "clear") { $$(".piece", spread).forEach((p) => p.remove()); drawSvg.innerHTML = ""; updateKit(); return; }
          tool = t; spread.dataset.mode = ["move", "pencil", "eraser"].includes(t) ? t : "stamp";
          paint.className = `paint mode-${spread.dataset.mode}`;
          $$("[data-tool]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.tool === t));
        };
        $$("[data-tool]").forEach((b) => b.addEventListener("click", () => setTool(b.dataset.tool)));
        $$("[data-col]").forEach((b) => b.addEventListener("click", () => { pen = b.dataset.col; $("[data-well]").style.background = pen; $$("[data-col]").forEach((x) => x.setAttribute("aria-pressed", x === b)); if (tool !== "pencil" && tool !== "star" && tool !== "heart") setTool("pencil"); }));
        $("[data-shelf]").innerHTML = shelfItems.map((p) => `<button type="button" class="item" data-kit="${esc(p.id)}" title="Drag onto the page, or tap to add">${svgArt(productArt(p), productHex(p))}<b>${esc(p.name)}</b><span>${money(p.price)}</span></button>`).join("");
        const pieceAt = (p, x, y) => {
          const el = document.createElement("div");
          el.className = "piece"; el.dataset.pid = p.id; el.tabIndex = 0; el.setAttribute("aria-label", p.name);
          const w = spread.clientWidth, h = spread.clientHeight;
          x = Math.min(Math.max(x, 60), Math.max(60, w - 60)); y = Math.min(Math.max(y, 60), Math.max(60, h - 60));
          el.style.left = x - 60 + "px"; el.style.top = y - 60 + "px"; el.style.rotate = (Math.random() * 20 - 10).toFixed(0) + "deg";
          el.innerHTML = svgArt(productArt(p), productHex(p), "sticker");
          spread.appendChild(el); updateKit();
        };
        $$("[data-kit]").forEach((tile) => tile.addEventListener("pointerdown", (e) => {
          e.preventDefault();
          const p = productById(tile.dataset.kit), r = spread.getBoundingClientRect();
          const ghost = tile.querySelector("svg").cloneNode(true);
          Object.assign(ghost.style, { position: "fixed", width: "110px", height: "110px", pointerEvents: "none", zIndex: 3000, left: e.clientX - 55 + "px", top: e.clientY - 55 + "px" });
          document.body.appendChild(ghost);
          const sx = e.clientX, sy = e.clientY;
          const move = (ev) => { ghost.style.left = ev.clientX - 55 + "px"; ghost.style.top = ev.clientY - 55 + "px"; };
          const up = (ev) => {
            removeEventListener("pointermove", move); removeEventListener("pointerup", up); ghost.remove();
            const moved = Math.hypot(ev.clientX - sx, ev.clientY - sy) > 6;
            const inside = ev.clientX > r.left && ev.clientX < r.right && ev.clientY > r.top && ev.clientY < r.bottom;
            if (moved && inside) pieceAt(p, ev.clientX - r.left, ev.clientY - r.top);
            else if (!moved) pieceAt(p, 70 + Math.random() * Math.max(10, r.width - 140), 70 + Math.random() * Math.max(10, r.height - 140));
          };
          addEventListener("pointermove", move); addEventListener("pointerup", up);
        }));
        $$("[data-kit]").forEach((tile) => tile.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); const r = spread.getBoundingClientRect(); pieceAt(productById(tile.dataset.kit), r.width / 2, r.height / 2); } }));
        makeDraggable(spread, ".piece", () => tool === "move");
        let line = null;
        spread.addEventListener("pointerdown", (e) => {
          const r = spread.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
          if (tool === "eraser") { const pc = e.target.closest(".piece"); if (pc) { pc.remove(); updateKit(); } else { const m = e.target.closest("path, g.stamp"); if (m && drawSvg.contains(m)) m.remove(); } return; }
          if (tool === "star" || tool === "heart") {
            drawSvg.insertAdjacentHTML("beforeend", `<g class="stamp" transform="translate(${x - 22} ${y - 22}) scale(.44)">${tool === "star" ? `<polygon points="50,9 61,37 91,38 67,57 76,87 50,70 24,87 33,57 9,38 39,37" fill="${pen}"/>` : `<path d="M50 87C21 66 8 48 13 31c5-17 28-21 37-4 9-17 32-13 37 4 5 17-8 35-37 56z" fill="${pen}"/>`}</g>`);
            updateKit(); return;
          }
          if (tool === "pencil") {
            e.preventDefault(); spread.setPointerCapture(e.pointerId);
            line = document.createElementNS("http://www.w3.org/2000/svg", "path");
            Object.entries({ fill: "none", stroke: pen, "stroke-width": "4", "stroke-linecap": "round", "stroke-linejoin": "round" }).forEach(([k, v]) => line.setAttribute(k, v));
            line.dataset.d = `M${x.toFixed(1)} ${y.toFixed(1)}`; line.setAttribute("d", line.dataset.d); drawSvg.appendChild(line); updateKit();
          }
        });
        spread.addEventListener("pointermove", (e) => { if (!line) return; const r = spread.getBoundingClientRect(); line.dataset.d += ` L${(e.clientX - r.left).toFixed(1)} ${(e.clientY - r.top).toFixed(1)}`; line.setAttribute("d", line.dataset.d); });
        spread.addEventListener("pointerup", () => (line = null));
        function kitIds() { return $$(".piece", spread).map((p) => p.dataset.pid); }
        function updateKit() {
          const ps = kitIds().map(productById).filter(Boolean);
          const full = ps.reduce((n, p) => n + p.price, 0), off = ps.length >= KIT.minPieces ? KIT.discount : 0, total = Math.round(full * (1 - off) * 100) / 100;
          $("[data-hint]").style.opacity = ps.length || drawSvg.childElementCount ? 0 : 1;
          $("[data-kit-total]").innerHTML = ps.length
            ? `${ps.length} piece${ps.length > 1 ? "s" : ""} ${off ? `<s>${money(full)}</s>` : ""}<b>${money(total)}</b>${off ? `you save ${money(full - total)} ♡` : `add ${KIT.minPieces - ps.length} more to save ${pct}%`}`
            : `<b>${money(0)}</b>your kit is empty`;
          $("[data-add-kit]").disabled = !ps.length;
        }
        updateKit();
        $("[data-add-kit]").addEventListener("click", () => {
          const info = addKitToCart(kitIds());
          if (!info) return;
          toast(info.full !== info.price ? `Kit added to your bag. You saved ${money(info.full - info.price)} ♡` : "Kit added to your bag ♡", "notebook", "pink");
        });
        $("[data-save]").addEventListener("click", () => {
          const w = spread.offsetWidth, h = spread.offsetHeight;
          let dots = ""; for (let x = 10; x < w; x += 20) for (let y = 10; y < h; y += 20) dots += `<circle cx="${x}" cy="${y}" r="1.3" fill="#f6cfe0"/>`;
          const pieces = $$(".piece", spread).map((el) => { const p = productById(el.dataset.pid), [l, t] = pos(el), rot = parseFloat(el.style.rotate) || 0;
            return `<g transform="translate(${l} ${t}) rotate(${rot} 60 60)"><svg width="120" height="120" viewBox="0 0 100 100">${DRAW[productArt(p)](productHex(p))}</svg></g>`; }).join("");
          const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="100%" height="100%" fill="#fff"/>${dots}<rect x="${w / 2 - 14}" width="28" height="${h}" fill="#2e2460" opacity=".06"/>${pieces}${drawSvg.innerHTML}<text x="${w - 16}" y="${h - 16}" text-anchor="end" font-family="sans-serif" font-size="14" fill="#de4e93">made at ${esc(S.name)} ♡</text></svg>`;
          const img = new Image();
          img.onload = () => {
            const cv = document.createElement("canvas"); cv.width = w * 2; cv.height = h * 2; const cx = cv.getContext("2d"); cx.scale(2, 2); cx.drawImage(img, 0, 0);
            const a = document.createElement("a"); a.download = "my-journal-kit.png"; a.href = cv.toDataURL("image/png"); a.click();
            toast("Saved! Post it and tag us ♡", "star", "pink");
          };
          img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
        });
        // start with a couple of pieces so the page isn't empty
        if (shelfItems[0]) pieceAt(shelfItems[0], 170, 190);
        if (shelfItems[1]) pieceAt(shelfItems[1], 330, 150);
        if (!shelfItems.length) $(".kit").remove();
      }

      /* ---------- 6. camera ---------- */
      {
        const roll = H.cameraRoll || [];
        const screen = $("[data-screen]");
        screen.insertAdjacentHTML("afterbegin", roll.map((r, i) => `<div class="duo ${i ? "" : "on"}" data-shot><img src="${esc(r.image)}" alt="${esc(r.caption || "")}" ${i ? 'loading="lazy"' : ""}></div>`).join(""));
        const shots = $$("[data-shot]", screen); let k = 0;
        const show = (n, flash) => {
          if (!shots.length) return;
          k = (n + shots.length) % shots.length;
          shots.forEach((s, i) => s.classList.toggle("on", i === k));
          $("[data-hud]").textContent = `▶ ${k + 1}/${shots.length}`; $("[data-date]").textContent = roll[k].date || ""; $("[data-caption]").textContent = roll[k].caption || "";
          if (flash && !reduceMotion) { const f = $("[data-flash]"); f.classList.remove("go"); void f.offsetWidth; f.classList.add("go"); }
        };
        $$("[data-shutter]").forEach((b) => b.addEventListener("click", () => show(k + 1, true)));
        $$("[data-next]").forEach((b) => b.addEventListener("click", () => show(k + 1)));
        $$("[data-prev]").forEach((b) => b.addEventListener("click", () => show(k - 1)));
        if (shots.length) show(0); else $("#camera").remove();
      }

      /* ---------- 10. reviews ---------- */
      $("[data-reviews]").innerHTML = (S.reviews || []).map((r) => `
        <figure class="hm-review"><img src="${esc(r.image)}" alt="Photo from ${esc(r.name)}" loading="lazy"><figcaption><span class="stars" aria-label="5 out of 5 stars">★★★★★</span><blockquote>“${esc(r.text)}”</blockquote><b>${esc(r.name)}</b></figcaption></figure>`).join("");
      if (!(S.reviews || []).length) $("[data-reviews]").closest("section").remove();

      /* ---------- 11. newsletter ---------- */
      $("[data-mail]").addEventListener("submit", (e) => { e.preventDefault(); e.target.reset(); toast("Sent! Check your inbox for your 10% code ✉", "envelope", "pink"); });

      paint();

      /* ---------- hero stickers: peel them off and stick them anywhere ---------- */
      {
        const hero = $(".hm-hero");
        $$(".hm-peek", hero).forEach((el) => { el.tabIndex = 0; });
        makeDraggable(hero, ".hm-peek");
        hero.addEventListener("pointerup", () => $$(".hm-peek", hero).forEach((el) => {
          if (!el.classList.contains("was-dragged")) return;
          el.classList.remove("was-dragged", "stuck"); void el.getBoundingClientRect(); el.classList.add("stuck");
          el.style.rotate = (Math.random() * 24 - 12).toFixed(0) + "deg";
        }));
        hero.addEventListener("pointerdown", (e) => { const el = e.target.closest(".hm-peek"); if (el) el.classList.add("was-dragged"); });
      }

      /* ---------- sparkle trail behind the mouse ---------- */
      let last = 0;
      main.addEventListener("pointermove", (e) => {
        if (e.pointerType !== "mouse" || reduceMotion || Date.now() - last < 60) return; last = Date.now();
        const s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        s.setAttribute("viewBox", "0 0 100 100"); s.setAttribute("class", "sparkle-trail"); s.setAttribute("aria-hidden", "true");
        const t = SA.TRAIL[SA.styleId()] || { d: "M50 4c5 30 16 41 46 46-30 5-41 16-46 46-5-30-16-41-46-46 30-5 41-16 46-46z", c: ["#f177ae", "#83c3c3", "#ffe07d", "#de4e93"] }; // follows the chosen style
        s.innerHTML = `<path d="${t.d}" fill="${t.c[Math.floor(Math.random() * t.c.length)]}"/>`;
        s.style.left = e.clientX - 7 + "px"; s.style.top = e.clientY - 7 + "px";
        document.body.appendChild(s); setTimeout(() => s.remove(), 700);
      });
    },
  });
})();
