/* =========================================================
   SENTIMENTAL APPLE — FIND YOUR STYLE (style.html)
   The styles and the 6 quiz questions live in js/data.js
   (styles: [...] and quiz: [...]). Products are matched by
   their  styles: ["coquette", ...]  list.
   ========================================================= */
(function () {
  "use strict";

  // little answer pictures (viewBox 0 0 100 100, coloured by the answer's style)
  const PIC = {
    envelope: (c) => `<rect x="12" y="26" width="76" height="52" rx="8" fill="${c}"/><path d="M16 32l34 24 34-24" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`,
    flower: (c) => `<g fill="${c}"><circle cx="50" cy="26" r="15"/><circle cx="73" cy="44" r="15"/><circle cx="64" cy="71" r="15"/><circle cx="36" cy="71" r="15"/><circle cx="27" cy="44" r="15"/></g><circle cx="50" cy="52" r="11" fill="#ffe07d"/>`,
    star: (c) => `<polygon points="50,9 61,37 91,38 67,57 76,87 50,70 24,87 33,57 9,38 39,37" fill="${c}" stroke="${c}" stroke-width="8" stroke-linejoin="round"/>`,
    moon: (c) => `<path d="M64 10A42 42 0 1 0 92 72 33 33 0 1 1 64 10z" fill="${c}"/><circle cx="74" cy="26" r="3" fill="${c}"/><circle cx="84" cy="44" r="2" fill="${c}"/>`,
    thorn: (c) => `<path d="M50 4l6 34 32-16-24 26 32 8-34 4 14 34-26-26-26 26 14-34-34-4 32-8L12 22l32 16z" fill="${c}"/>`,
    bow: (c) => `<path d="M50 48C38 30 14 22 12 38s20 26 38 10zM50 48c12-18 36-26 38-10s-20 26-38 10z" fill="${c}"/><path d="M46 52l-14 36 10-4 8 8zM54 52l14 36-10-4-8 8z" fill="${c}"/><circle cx="50" cy="48" r="8" fill="${c}" stroke="#fff" stroke-width="3"/>`,
    butterfly: (c) => `<path d="M48 50C40 24 10 14 12 36c1 12 16 18 36 14zM52 50c8-26 38-36 36-14-1 12-16 18-36 14zM48 52c-16 2-30 12-24 26 6 12 22 2 24-26zM52 52c16 2 30 12 24 26-6 12-22 2-24-26z" fill="${c}"/><rect x="47" y="30" width="6" height="46" rx="3" fill="#2e2460" opacity=".55"/>`,
    heart: (c) => `<path d="M50 87C21 66 8 48 13 31c5-17 28-21 37-4 9-17 32-13 37 4 5 17-8 35-37 56z" fill="${c}"/>`,
    leaf: (c) => `<path d="M16 84C14 40 44 14 88 14c0 44-26 72-72 70z" fill="${c}"/><path d="M18 82C40 60 56 44 76 26" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/>`,
    sparkle: (c) => `<path d="M40 6c4 24 12 32 36 36-24 4-32 12-36 36-4-24-12-32-36-36 24-4 32-12 36-36z" fill="${c}"/><path d="M78 58c2 12 6 16 18 18-12 2-16 6-18 18-2-12-6-16-18-18 12-2 16-6 18-18z" fill="${c}"/>`,
    drop: (c) => `<path d="M50 8C36 34 22 50 22 66a28 28 0 0 0 56 0C78 50 64 34 50 8z" fill="${c}"/><ellipse cx="38" cy="64" rx="5" ry="9" fill="#fff" opacity=".5"/>`,
    bolt: (c) => `<path d="M58 4L18 58h28l-8 38 44-58H52z" fill="${c}"/>`,
  };
  const ICON_OF = { coquette: "bow", cottagecore: "flower", y2k: "butterfly", goth: "moon", cybersigilism: "thorn" };
  const pic = (name, c) => `<svg viewBox="0 0 100 100" aria-hidden="true">${(PIC[name] || PIC.heart)(c)}</svg>`;

  window.SA_PAGES = Object.assign(window.SA_PAGES || {}, {
    style(SA) {
      const { S, $, $$, esc, money, params } = SA;
      const STY = S.styles || [];
      const byId = (id) => STY.find((x) => x.id === id);
      const accent = (st) => st.palette[2];
      const productsFor = (st) => S.products.filter((p) => (p.styles || []).includes(st.id));
      STY.forEach((st) => window.SA_loadStyleFonts && window.SA_loadStyleFonts(st.id)); // so every preview shows its own fonts

      const views = { intro: $("[data-view=intro]"), quiz: $("[data-view=quiz]"), result: $("[data-view=result]"), browse: $("[data-view=browse]") };
      const show = (...on) => Object.entries(views).forEach(([k, el]) => (el.hidden = !on.includes(k)));

      /* ---------- "you're wearing ..." line ---------- */
      function drawCurrent() {
        const cur = byId(SA.styleId());
        $("[data-reset-wrap]").hidden = !cur;
        if (cur) $("[data-current]").textContent = cur.name;
      }
      $("[data-reset]").addEventListener("click", () => { wear(null); });

      /* ---------- browse cards (each one previews its own style) ---------- */
      $("[data-cards]").innerHTML = STY.map((st) => {
        const n = productsFor(st).length;
        return `<button class="sf-card" type="button" data-style="${st.id}" data-open="${st.id}">
          <span class="sf-card__pic">${pic(ICON_OF[st.id], accent(st))}</span>
          <span class="sf-name">${esc(st.name)}</span>
          <span class="sf-card__tag">${esc(st.tagline)}</span>
          <span class="sf-dots">${st.palette.map((c) => `<i style="background:${c}"></i>`).join("")}</span>
          <span class="sf-card__count">${n ? `${n} ${n === 1 ? "thing" : "things"} to shop` : "Coming soon"}</span>
        </button>`;
      }).join("");
      $$("[data-open]").forEach((b) => b.addEventListener("click", () => reveal(byId(b.dataset.open), false)));

      /* ---------- quiz ---------- */
      let step = 0, picks = [];
      function ask() {
        const Q = S.quiz[step];
        $("[data-progress]").innerHTML = S.quiz.map((_, k) => `<i class="${k < step ? "done" : k === step ? "now" : ""}"></i>`).join("");
        $("[data-step]").textContent = `Question ${step + 1} of ${S.quiz.length}`;
        $("[data-q]").textContent = Q.q;
        $("[data-answers]").setAttribute("aria-label", Q.q);
        $("[data-answers]").innerHTML = Q.a.map((a, k) => {
          const st = byId(a.s);
          const art = a.sw ? `<span class="sf-swatch">${a.sw.map((c) => `<i style="background:${c}"></i>`).join("")}</span>` : `<span class="sf-ans__pic">${pic(a.i, accent(st))}</span>`;
          return `<button class="sf-ans" type="button" data-a="${k}">${art}<span>${esc(a.t)}</span></button>`;
        }).join("");
        $$("[data-a]").forEach((b) => b.addEventListener("click", () => {
          picks[step] = Q.a[+b.dataset.a].s;
          if (step < S.quiz.length - 1) { step++; ask(); $("[data-answers] button").focus(); }
          else reveal(score(), true);
        }));
        $("[data-back]").hidden = step === 0;
      }
      $("[data-back]").addEventListener("click", () => { if (step > 0) { step--; ask(); } });
      function score() {
        const tally = {};
        picks.forEach((s) => (tally[s] = (tally[s] || 0) + 1));
        const top = Math.max(...Object.values(tally));
        // a tie goes to the style picked most recently
        for (let k = picks.length - 1; k >= 0; k--) if (tally[picks[k]] === top) return byId(picks[k]);
        return STY[0];
      }
      function startQuiz() { step = 0; picks = []; show("quiz"); ask(); scrollTo({ top: 0, behavior: "smooth" }); $("[data-q]").focus?.(); }
      $("[data-start]").addEventListener("click", startQuiz);

      /* ---------- result ---------- */
      function reveal(st, fromQuiz) {
        if (!st) return;
        const wearing = SA.styleId() === st.id;
        const list = productsFor(st);
        history.replaceState(null, "", `style.html?s=${st.id}`);
        $("[data-reveal]").setAttribute("data-style", st.id);
        $("[data-reveal]").innerHTML = `
          <div class="sf-reveal__pic">${pic(ICON_OF[st.id], accent(st))}</div>
          <div class="sf-reveal__text">
            <p class="sf-hand">${fromQuiz ? "your style is" : "the style"}</p>
            <h1 class="sf-name">${esc(st.name)}</h1>
            <p class="sf-tagline">${esc(st.tagline)}</p>
            <p>${esc(st.about)}</p>
            <ul class="sf-vibe">${st.vibe.map((v) => `<li>${esc(v)}</li>`).join("")}</ul>
            <div class="sf-dots sf-dots--lg">${st.palette.map((c) => `<i style="background:${c}"></i>`).join("")}</div>
            <div class="sf-actions">
              <button class="pill glossy" type="button" data-wear>${wearing ? "You're wearing this ♡" : "Wear this style"}</button>
              ${list.length ? `<a class="pill sf-ghost" href="shop.html?cat=mine" data-shop>Shop ${esc(st.name)}</a>` : ""}
              <button class="sf-link" type="button" data-save>Save my result</button>
              <button class="sf-link" type="button" data-retake>${fromQuiz ? "Retake the quiz" : "Take the quiz"}</button>
            </div>
          </div>`;
        $("[data-picks-title]").textContent = list.length ? `Made for ${st.name.toLowerCase()} hearts` : `${st.name} is coming soon`;
        $("[data-picks]").innerHTML = list.length ? list.map(card).join("") : soon(st);
        $$("[data-add]", $("[data-picks]")).forEach((b) => b.addEventListener("click", () => {
          const p = SA.productById(b.dataset.add); SA.addToCart(p.id, 1, p.colors ? p.colors[0][1] : "");
        }));
        $("[data-wear]").addEventListener("click", () => { wear(st.id); reveal(st, fromQuiz); });
        const shopLink = $("[data-shop]");
        if (shopLink) shopLink.addEventListener("click", () => wear(st.id)); // the shop opens on "Your style"
        $("[data-save]").addEventListener("click", () => saveImage(st));
        $("[data-retake]").addEventListener("click", startQuiz);
        show("result", "browse");
        scrollTo({ top: 0, behavior: fromQuiz ? "smooth" : "auto" });
      }
      function card(p) {
        const { svgArt } = window.SA_ART;
        const hex = p.colors && p.colors[0] ? p.colors[0][0] : { apple: "#e84a55", pink: "#f177ae", butter: "#ffe07d", teal: "#83c3c3", mint: "#83c3c3", blush: "#ffb3d2" }[p.color] || "#f177ae";
        const ART = { stickers: "sheet", notebooks: "notebook", postcards: "postcard", prints: "print", journalling: "washi", bundles: "gift" };
        return `<article class="sf-prod">
          <a class="sf-prod__pic" href="product.html?id=${esc(p.id)}" style="background:linear-gradient(${hex}22, ${hex}22), var(--c-surface, #fff)">${p.image ? `<img src="${esc(p.image)}" alt="">` : svgArt(ART[p.category] || p.icon || "heart", hex, "sticker")}</a>
          <a class="sf-prod__name" href="product.html?id=${esc(p.id)}">${esc(p.name)}</a>
          <div class="sf-prod__row"><span>${money(p.price)}</span>${p.soldOut ? `<span class="sf-out">Sold out</span>` : `<button type="button" class="sf-add" data-add="${esc(p.id)}">Add to bag</button>`}</div>
        </article>`;
      }
      function soon(st) {
        return [0, 1, 2].map((k) => `<div class="sf-soon" style="--a:${accent(st)}">
          <span class="sf-soon__pic">${pic(["star", "sparkle", "heart"][k], accent(st))}</span>
          <b>Coming soon</b><span>We're drawing the ${esc(st.name.toLowerCase())} collection right now.</span></div>`).join("") +
          `<p class="sf-soon__note">You can still wear the ${esc(st.name)} look around the shop while you wait. <a href="shop.html">Browse everything</a></p>`;
      }

      /* ---------- wear a style: the whole site changes ---------- */
      function wear(id) {
        window.SA_setStyle(id);
        if (SA.user && SA.sb) SA.sb.from("profiles").update({ style: id }).eq("id", SA.user.id).then(() => {}, () => {}); // remember it on their account too
        const chip = $(".style-chip"); const st = byId(id);
        if (chip) chip.remove();
        if (st) $(".header-actions").insertAdjacentHTML("afterbegin", `<a class="style-chip" href="style.html?s=${st.id}" aria-label="Your style: ${esc(st.name)}"><span aria-hidden="true">${st.emoji}</span><span>${esc(st.name)}</span></a>`);
        SA.toast(st ? `Now wearing ${st.name} ${st.emoji}` : "Back to the original look", "heart", "pink");
        drawCurrent();
      }

      /* ---------- save the result as a picture ---------- */
      async function saveImage(st) {
        const W = 1080, H = 1350, cv = document.createElement("canvas"); cv.width = W; cv.height = H;
        const g = cv.getContext("2d");
        const dark = st.id === "goth" || st.id === "cybersigilism";
        const [bg, , acc, ink] = st.palette;
        const text = dark ? st.palette[3] : ink;
        const head = getComputedStyle($("[data-reveal]")).getPropertyValue("--f-head").trim().replace(/"/g, "") || "Shrikhand";
        try { await document.fonts.load(`80px "${head}"`); } catch (e) {}
        g.fillStyle = bg; g.fillRect(0, 0, W, H);
        g.fillStyle = acc; g.globalAlpha = .12;
        for (let y = 40; y < H; y += 90) for (let x = (y / 90) % 2 ? 40 : 85; x < W; x += 90) { g.beginPath(); g.arc(x, y, 6, 0, 7); g.fill(); }
        g.globalAlpha = 1;
        const img = new Image(); img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${(PIC[ICON_OF[st.id]] || PIC.heart)(acc)}</svg>`);
        await new Promise((ok) => { img.onload = ok; img.onerror = ok; });
        g.drawImage(img, W / 2 - 170, 170, 340, 340);
        g.textAlign = "center"; g.fillStyle = text;
        g.font = "600 44px sans-serif";
        g.fillText("my journal style is", W / 2, 620);
        g.font = `${st.id === "coquette" || st.id === "cottagecore" ? "italic " : ""}${st.id === "cybersigilism" ? 800 : 600} 150px "${head}", serif`;
        g.fillStyle = acc; g.fillText(st.id === "cybersigilism" ? st.name.toLowerCase() : st.name, W / 2, 790, W - 120);
        g.fillStyle = text; g.font = `600 46px sans-serif`; g.fillText(st.tagline, W / 2, 880, W - 120);
        st.palette.forEach((c, k) => { g.beginPath(); g.arc(W / 2 - 165 + k * 110, 1010, 40, 0, 7); g.fillStyle = c; g.fill(); g.lineWidth = 6; g.strokeStyle = dark ? "#ffffff55" : "#ffffff"; g.stroke(); });
        g.fillStyle = text; g.globalAlpha = .75; g.font = `600 38px sans-serif`;
        g.fillText("find yours at Sentimental Apple ♡", W / 2, 1230);
        const a = document.createElement("a");
        a.download = `my-style-${st.id}.png`; a.href = cv.toDataURL("image/png"); a.click();
        SA.toast("Saved your result picture", "heart", "pink");
      }

      /* ---------- go ---------- */
      drawCurrent();
      const start = byId(params.get("s"));
      if (start) reveal(start, false); else show("intro", "browse");
    },
  });
})();
