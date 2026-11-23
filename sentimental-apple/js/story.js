/* =========================================================
   SENTIMENTAL APPLE — "OUR STORY" (magazine spread)
   Words and photos come from js/data.js → story
   ========================================================= */
(function () {
  "use strict";
  window.SA_PAGES = Object.assign(window.SA_PAGES || {}, {
    about(SA) {
      const { S, $, $$, esc, toast } = SA;
      const { DRAW, svgArt, ransom, RIBBON } = window.SA_ART;
      const st = S.story;
      const COLOR = { pink: "#f177ae", teal: "#83c3c3", butter: "#ffe07d", apple: "#e84a55", mint: "#83c3c3", blush: "#ffb3d2" };

      // torn paper edge for photos
      const torn = (el, seed) => {
        const p = []; let r = seed; const j = () => { r = (r * 9301 + 49297) % 233280; return (r / 233280) * 1.6; };
        for (let x = 0; x <= 100; x += 4) p.push(`${x}% ${j()}%`); for (let y = 0; y <= 100; y += 4) p.push(`${100 - j()}% ${y}%`);
        for (let x = 100; x >= 0; x -= 4) p.push(`${x}% ${100 - j()}%`); for (let y = 100; y >= 0; y -= 4) p.push(`${j()}% ${y}%`);
        el.style.clipPath = `polygon(${p.join(",")})`;
      };
      const photo = (src, alt, emptyLabel, art = "heart", color = "#f177ae") => src
        ? `<div class="duo"><img src="${esc(src)}" alt="${esc(alt)}" loading="lazy"></div>`
        : `<div class="ph-empty">${svgArt(art, color, "sticker")}<span>${esc(emptyLabel)}</span></div>`;

      /* ---------- spread 1: the story ---------- */
      $("[data-intro]").textContent = st.intro;
      $("[data-paras]").innerHTML = st.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("");
      $("[data-snaps]").innerHTML = (st.photos || []).slice(0, 2).map((ph, i) => `
        <figure class="snap snap--${i + 1}"><span class="tape"></span>${photo(ph.image, ph.caption, "photo coming soon ♡")}<figcaption>${esc(ph.caption || "")}</figcaption></figure>`).join("");
      $("[data-values]").innerHTML = st.values.map((v) => `
        <li>${svgArt(v.icon, COLOR[v.color] || "#f177ae", "sticker")}<div><b>${esc(v.title)}</b><span>${esc(v.text)}</span></div></li>`).join("");

      /* ---------- spread 2: meet the girls ---------- */
      const colours = [["#f177ae", "#fcd6e7"], ["#83c3c3", "#d6eeee"]];
      $("[data-team]").innerHTML = (st.team || []).slice(0, 2).map((m, i) => {
        const [c, c2] = colours[i % 2];
        return `
        <article class="pg pg--${i ? "r" : "l"} girl" style="--c:${c};--c2:${c2}">
          <span class="role">${esc(m.role)}</span>
          <h2 class="ransom ransom--lg girl-name">${ransom(m.name, i * 11 + 5)}</h2>
          <div class="girl-grid">
            <figure class="portrait"><span class="tape"></span>${photo(m.photo, `Photo of ${m.name}`, "your photo here ♡", i ? "star" : "heart", c)}</figure>
            <div class="girl-side">
              <p class="bio">${esc(m.bio)}</p>
              <div class="faves">
                <h3>♡ favourite things</h3>
                <ul>${(m.favourites || []).map((f) => `<li>${esc(f)}</li>`).join("")}</ul>
              </div>
            </div>
          </div>
          ${m.quote ? `<p class="quote">“${esc(m.quote)}”</p>` : ""}
          <div class="mood">${(m.aesthetics || []).slice(0, 3).map((a, k) => `
            <figure class="mood-tile" style="rotate:${[-3, 2, -1.5][k]}deg">${photo(a.image, a.label, "add a pic", ["flower", "sparkle", "cloud"][k] || "heart", c)}<figcaption>${esc(a.label)}</figcaption></figure>`).join("")}</div>
          <span class="pgno">0${i + 3}</span>
        </article>`;
      }).join("");

      /* ---------- decorations ---------- */
      $$("[data-ribbon]").forEach((el) => { el.setAttribute("viewBox", "0 0 200 170"); el.innerHTML = RIBBON; });
      $$("[data-ransom]").forEach((el, i) => (el.innerHTML = ransom(el.dataset.ransom, i + 31)));
      $$(".snap, .portrait").forEach((el, i) => torn(el, 7 + i));
      $$(".spread").forEach((el, i) => el.style.setProperty("--tilt", i % 2 ? ".4deg" : "-.4deg"));

      /* ---------- write to us ---------- */
      const f = $("[data-newsletter]");
      f.addEventListener("submit", (e) => { e.preventDefault(); f.innerHTML = `<p class="done">You're on the list! Check your inbox for your 10% code ♡</p>`; toast("Welcome to the pen-pal list", "envelope", "mint"); });
    },
  });
})();
