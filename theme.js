/* Applies the shopper's chosen style (from style.html) before the page draws,
   so there's no flash of the default look. Loaded in <head> on every page. */
(function () {
  var FONTS = {
    coquette: "Bodoni+Moda:ital,wght@0,600;1,600&family=Great+Vibes",
    cottagecore: "Fraunces:ital,wght@0,600;1,600&family=Lora:wght@400;600",
    y2k: "Rubik+Bubbles&family=Nunito:wght@400;700;800",
    goth: "UnifrakturMaguntia&family=EB+Garamond:wght@400;600",
    cybersigilism: "Syne:wght@700;800&family=Space+Grotesk:wght@400;600",
  };
  var style = null;
  try { style = localStorage.getItem("sa_style"); } catch (e) {}
  window.SA_setStyle = function (id) {
    if (id && !FONTS[id]) id = null;
    try { id ? localStorage.setItem("sa_style", id) : localStorage.removeItem("sa_style"); } catch (e) {}
    apply(id);
  };
  function apply(id) {
    var html = document.documentElement;
    if (id) html.setAttribute("data-style", id); else html.removeAttribute("data-style");
    if (id) loadFonts(id);
  }
  function loadFonts(id) { if (FONTS[id] && !document.getElementById("font-" + id)) { var l = document.createElement("link"); l.id = "font-" + id; l.rel = "stylesheet"; l.href = "https://fonts.googleapis.com/css2?family=" + FONTS[id] + "&display=swap"; document.head.appendChild(l); } }
  window.SA_loadStyleFonts = loadFonts;
  if (style && FONTS[style]) apply(style);
})();
