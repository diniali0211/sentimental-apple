/* =========================================================
   SENTIMENTAL APPLE — SHOP & PRODUCT PAGES
   Products, categories and collections come from js/data.js
   (or the database, once it's switched on).
   ========================================================= */
(function () {
  "use strict";
  const CAT_ART = { stickers: "sheet", notebooks: "notebook", postcards: "postcard", prints: "print", journalling: "washi", bundles: "gift" };
  const COLOR = { apple: "#e84a55", pink: "#f177ae", butter: "#ffe07d", teal: "#83c3c3", mint: "#83c3c3", blush: "#ffb3d2" };
  const HEART = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-8.6-9C2.3 7.6 4.6 4.6 7.7 4.6c2 0 3.4 1.2 4.3 2.6.9-1.4 2.3-2.6 4.3-2.6 3.1 0 5.4 3 4.3 6.4C19 15.6 12 20 12 20z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>';

  const tint = (hex) => `linear-gradient(${hex}22, ${hex}22), var(--c-surface, #fff)`;

  function kit(SA) {
    const { esc, money } = SA;
    const { svgArt } = window.SA_ART;
    const artOf = (p) => CAT_ART[p.category] || p.icon || "heart";
    const hexOf = (p, k = 0) => (p.colors && p.colors[k] ? p.colors[k][0] : COLOR[p.color] || "#f177ae");
    const pic = (p, k = 0) => (p.image ? `<img src="${esc(p.image)}" alt="">` : svgArt(artOf(p), hexOf(p, k), "sticker"));

    function card(p) {
      const label = p.soldOut ? "Sold out" : p.badge || (p.isNew ? "New" : "");
      const saved = SA.getWish().includes(p.id);
      return `<article class="sp-card" data-card="${esc(p.id)}">
        <div class="sp-card__pic" style="background:${tint(hexOf(p))}" data-tile>
          <a href="product.html?id=${esc(p.id)}" aria-label="${esc(p.name)}">${pic(p)}</a>
          ${label ? `<span class="sp-tag${p.soldOut ? " sp-tag--out" : ""}">${esc(label)}</span>` : ""}
          <button class="sp-heart" type="button" data-wish aria-pressed="${saved}" aria-label="Save ${esc(p.name)}">${HEART}</button>
        </div>
        <a class="sp-card__name" href="product.html?id=${esc(p.id)}">${esc(p.name)}</a>
        ${p.colors ? `<div class="sp-swatches" role="group" aria-label="Colour">${p.colors.map(([c, n], k) => `<button type="button" style="background:${c}" aria-label="${esc(n)}" aria-pressed="${k === 0}" data-sw="${k}"></button>`).join("")}<span data-swname>${esc(p.colors[0][1])}</span></div>` : ""}
        <div class="sp-card__row"><span class="sp-price">${money(p.price)}</span><button class="sp-add" type="button" data-add ${p.soldOut ? "disabled" : ""}>${p.soldOut ? "Sold out" : "Add to bag"}</button></div>
      </article>`;
    }
    function bind(root, onWish) {
      SA.$$("[data-card]", root).forEach((el) => {
        const p = SA.productById(el.dataset.card); let pick = 0;
        SA.$$("[data-sw]", el).forEach((b) => b.addEventListener("click", () => {
          pick = +b.dataset.sw; const [c, n] = p.colors[pick];
          SA.$$("[data-sw]", el).forEach((x) => x.setAttribute("aria-pressed", x === b));
          SA.$("[data-swname]", el).textContent = n;
          const tile = SA.$("[data-tile]", el); tile.style.background = tint(c);
          if (!p.image) SA.$("a", tile).innerHTML = svgArt(artOf(p), c, "sticker");
        }));
        SA.$("[data-add]", el).addEventListener("click", () => SA.addToCart(p.id, 1, p.colors ? p.colors[pick][1] : ""));
        SA.$("[data-wish]", el).addEventListener("click", (e) => { SA.toggleWish(p.id, e.currentTarget); if (onWish) onWish(); });
      });
    }
    return { card, bind, pic, artOf, hexOf, svgArt };
  }

  window.SA_PAGES = Object.assign(window.SA_PAGES || {}, {
    /* =========================================================
       SHOP
       ========================================================= */
    shop(SA) {
      const { S, $, $$, esc, params, catById } = SA;
      const K = kit(SA);
      const tiles = [{ id: "all", name: "Everything", art: "gift", hex: "#f177ae" }]
        .concat(S.categories.map((c) => ({ id: c.id, name: c.name, art: CAT_ART[c.id] || c.icon, hex: COLOR[c.color] || "#f177ae" })),
          [{ id: "saved", name: "Saved", art: "heart", hex: "#de4e93" }]);
      const mine = SA.styleInfo(); // a style picked on style.html adds a "Your style" tile and opens on it
      if (mine) tiles.unshift({ id: "mine", name: `Your ${mine.name}`, art: "star", hex: mine.palette[2] });
      let cat = params.get("cat") || (mine && !params.get("col") ? "mine" : "all");
      if (!tiles.some((t) => t.id === cat)) cat = "all";
      let col = (S.collections || []).find((c) => c.id === params.get("col"));
      const grid = $("[data-grid]"), search = $("[data-search]"), sort = $("[data-sort]");

      function draw() {
        $("[data-cats]").innerHTML = tiles.map((t) => `
          <button class="sp-cat" type="button" data-cat="${t.id}" aria-pressed="${!col && t.id === cat}">
            <span class="sp-cat__pic" style="background:${t.hex}2e">${K.svgArt(t.art, t.hex, "sticker")}</span><b>${esc(t.name)}</b></button>`).join("");
        $$("[data-cat]").forEach((b) => b.addEventListener("click", () => {
          cat = b.dataset.cat; col = null; history.replaceState(null, "", cat === "all" ? "shop.html" : `shop.html?cat=${cat}`); draw();
        }));
        const title = col ? col.name : cat === "all" ? "The whole shop" : cat === "saved" ? "Your saved things" : cat === "mine" ? `Your ${mine.name.toLowerCase()} edit` : catById(cat).name;
        $("[data-title]").textContent = title;
        $("[data-crumb]").textContent = title;
        $("[data-intro]").textContent = col ? `${col.products.length} hand-picked things in this collection.`
          : cat === "saved" ? "Everything you've hearted, waiting for you."
          : cat === "mine" ? `${mine.tagline[0].toUpperCase() + mine.tagline.slice(1)}. Everything we make in your style.`
          : (catById(cat) && catById(cat).blurb) || "Everything we've drawn so far. Tap the heart to save things for later.";
        $("[data-col]").innerHTML = col ? `<img src="${esc(col.image)}" alt="${esc(col.name)}">` : "";
        $("[data-col]").hidden = !col;
        const q = search.value.trim().toLowerCase();
        const list = S.products.filter((p) =>
          (col ? col.products.includes(p.id) : cat === "all" || (cat === "saved" ? SA.getWish().includes(p.id) : cat === "mine" ? (p.styles || []).includes(mine.id) : p.category === cat)) &&
          (!q || (p.name + " " + p.description).toLowerCase().includes(q)));
        if (sort.value === "low") list.sort((a, b) => a.price - b.price);
        if (sort.value === "high") list.sort((a, b) => b.price - a.price);
        if (sort.value === "new") list.sort((a, b) => Number(b.isNew) - Number(a.isNew));
        $("[data-count]").textContent = `${list.length} ${list.length === 1 ? "thing" : "things"}`;
        grid.innerHTML = list.length ? list.map(K.card).join("") : cat === "mine" && !q ?
          `<div class="sp-empty">${K.svgArt("star", mine.palette[2], "sticker")}<h3>${esc(mine.name)} is coming soon</h3><p>We're drawing this collection right now. Browse the whole shop in the meantime, or <a href="style.html">try another style</a>.</p></div>` :
          `<div class="sp-empty">${K.svgArt(cat === "saved" ? "heart" : "cloud", "#83c3c3", "sticker")}<h3>${cat === "saved" ? "Nothing saved yet" : "Nothing matches that"}</h3><p>${cat === "saved" ? "Tap the heart on anything you love and it'll wait for you here." : "Try another word or pick a different category."}</p></div>`;
        K.bind(grid, () => { if (cat === "saved") draw(); });
      }
      search.addEventListener("input", draw); sort.addEventListener("change", draw);
      draw();
    },

    /* =========================================================
       PRODUCT
       ========================================================= */
    product(SA) {
      const { S, $, $$, esc, money, params, productById, catById } = SA;
      const K = kit(SA);
      const p = productById(params.get("id")) || S.products[0];
      const c = catById(p.category) || { id: p.category, name: p.category };
      document.title = `${p.name} | ${S.name}`;
      let qty = 1, pick = 0;
      const views = p.colors ? p.colors.map(([, n], k) => ({ k, n })) : [{ k: 0, n: "" }];

      $("[data-pdp]").innerHTML = `
        <nav class="sp-crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a> / <a href="shop.html">Shop</a> / <a href="shop.html?cat=${esc(c.id)}">${esc(c.name)}</a></nav>
        <div class="pdp-grid">
          <div class="pdp-gallery">
            <div class="pdp-main" data-main style="background:${tint(K.hexOf(p))}">${K.pic(p)}
              ${p.soldOut ? `<span class="sp-tag sp-tag--out">Sold out</span>` : p.badge ? `<span class="sp-tag">${esc(p.badge)}</span>` : p.isNew ? `<span class="sp-tag">New</span>` : ""}</div>
            ${views.length > 1 ? `<div class="pdp-thumbs" role="group" aria-label="Pictures">${views.map((v) => `<button type="button" class="pdp-thumb" data-view="${v.k}" aria-pressed="${v.k === 0}" aria-label="${esc(v.n)}" style="background:${tint(K.hexOf(p, v.k))}">${K.pic(p, v.k)}</button>`).join("")}</div>` : ""}
          </div>
          <div class="pdp-info">
            <a class="sp-pill" href="shop.html?cat=${esc(c.id)}">${esc(c.name)}</a>
            <h1>${esc(p.name)}</h1>
            <p class="pdp-price">${money(p.price)}</p>
            <p class="pdp-desc">${esc(p.description)}</p>
            ${p.colors ? `<div class="pdp-colour"><b>Colour: <span data-colour>${esc(p.colors[0][1])}</span></b><div class="sp-swatches sp-swatches--lg" role="group" aria-label="Colour">${p.colors.map(([hex, n], k) => `<button type="button" style="background:${hex}" aria-label="${esc(n)}" aria-pressed="${k === 0}" data-sw="${k}"></button>`).join("")}</div></div>` : ""}
            <div class="pdp-buy">
              <div class="sp-qty"><button type="button" data-q="-1" aria-label="One less">−</button><span data-qty>1</span><button type="button" data-q="1" aria-label="One more">+</button></div>
              <button class="sp-add sp-add--lg" type="button" data-buy ${p.soldOut ? "disabled" : ""}>${p.soldOut ? "Sold out" : "Add to bag"}</button>
              <button class="sp-heart sp-heart--lg" type="button" data-wish aria-pressed="${SA.getWish().includes(p.id)}" aria-label="Save ${esc(p.name)}">${HEART}</button>
            </div>
            <ul class="pdp-perks">
              <li><img src="images/icons/delivery.svg" alt=""> Free UK shipping over ${money(S.freeShippingOver)}</li>
              <li><img src="images/icons/returns.svg" alt=""> Easy returns within 30 days</li>
              <li><img src="images/icons/giving.svg" alt=""> 5% of your order goes to kids' art clubs</li>
            </ul>
            <div class="pdp-tabs">
              <div class="pdp-tabbar" role="tablist">
                <button type="button" role="tab" aria-selected="true" data-tab="0">Description</button>
                <button type="button" role="tab" aria-selected="false" data-tab="1">Shipping</button>
                <button type="button" role="tab" aria-selected="false" data-tab="2">Returns</button>
              </div>
              <div class="pdp-panel" role="tabpanel" data-panel="0"><p>${esc(p.description)}</p><p>Drawn by hand, printed on recycled paper wherever we can, and packed with a little surprise.</p></div>
              <div class="pdp-panel" role="tabpanel" data-panel="1" hidden><p>UK delivery is ${money(S.shippingCost)}, or free when you spend ${money(S.freeShippingOver)} or more. We pack orders by hand and post them within 2 working days.</p></div>
              <div class="pdp-panel" role="tabpanel" data-panel="2" hidden><p>Changed your mind? Send unused items back within 30 days and we'll refund you. Just email ${esc(S.contact.email)} first.</p></div>
            </div>
          </div>
        </div>`;

      const setView = (k) => {
        pick = k;
        const main = $("[data-main]"); main.style.background = tint(K.hexOf(p, k));
        main.querySelector("img, svg").outerHTML = K.pic(p, k);
        $$("[data-view]").forEach((b) => b.setAttribute("aria-pressed", +b.dataset.view === k));
        $$(".pdp-colour [data-sw]").forEach((b) => b.setAttribute("aria-pressed", +b.dataset.sw === k));
        if (p.colors) $("[data-colour]").textContent = p.colors[k][1];
      };
      $$("[data-view]").forEach((b) => b.addEventListener("click", () => setView(+b.dataset.view)));
      $$(".pdp-colour [data-sw]").forEach((b) => b.addEventListener("click", () => setView(+b.dataset.sw)));
      $$("[data-q]").forEach((b) => b.addEventListener("click", () => { qty = Math.max(1, Math.min(99, qty + Number(b.dataset.q))); $("[data-qty]").textContent = qty; }));
      $("[data-buy]").addEventListener("click", () => SA.addToCart(p.id, qty, p.colors ? p.colors[pick][1] : ""));
      $("[data-wish]").addEventListener("click", (e) => SA.toggleWish(p.id, e.currentTarget));
      $$("[data-tab]").forEach((t) => t.addEventListener("click", () => {
        $$("[data-tab]").forEach((x) => x.setAttribute("aria-selected", x === t));
        $$("[data-panel]").forEach((x) => (x.hidden = x.dataset.panel !== t.dataset.tab));
      }));

      const more = S.products.filter((x) => x.id !== p.id && x.category === p.category)
        .concat(S.products.filter((x) => x.id !== p.id && x.category !== p.category)).slice(0, 4);
      $("[data-more]").innerHTML = more.map(K.card).join("");
      K.bind($("[data-more]"));
    },
  });
})();
