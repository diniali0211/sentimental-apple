/* =========================================================
   SENTIMENTAL APPLE — ACCOUNT & ADMIN PAGES
   Only work when the database is switched on in js/config.js.
   ========================================================= */
(function () {
  "use strict";

  const STATUS = {
    pending: "Waiting for payment",
    paid: "Paid",
    packed: "Packed",
    shipped: "Shipped",
    cancelled: "Cancelled",
  };
  const ICONS = ["apple", "heart", "star", "cloud", "flower", "envelope", "notebook", "cherry", "rainbow", "sparkle"];
  const COLORS = ["teal", "pink", "butter", "apple", "mint", "blush"];

  const offline = (SA, root) => {
    root.innerHTML = `<div class="empty">${SA.art("cloud", "teal")}<h2>Accounts aren't switched on yet</h2>
      <p class="muted" style="margin-inline:auto">Connect the shop's database in <code>js/config.js</code> to use this page. The setup guide (SETUP.md) explains how.</p>
      <a class="btn" href="index.html">Back to home</a></div>`;
  };

  // Two-step delete: first click asks, second click within 4 seconds does it
  function confirmClick(btn, action) {
    btn.addEventListener("click", async () => {
      if (btn.dataset.armed) { btn.disabled = true; await action(); return; }
      const label = btn.textContent;
      btn.dataset.armed = "1"; btn.textContent = "Click again to delete";
      setTimeout(() => { if (btn.isConnected) { delete btn.dataset.armed; btn.textContent = label; } }, 4000);
    });
  }

  // ---------- Log in / sign up (shared by both pages) ----------
  function authForms(SA, root, { signup = true, intro = "" } = {}) {
    const { sb, esc, toast, params } = SA;
    root.innerHTML = `
      ${intro}
      <div class="auth-grid${signup ? "" : " auth-grid--one"}">
        <form class="form auth-card" data-login>
          <h2>Log in</h2>
          <label>Email<input class="field" name="email" type="email" autocomplete="email" required></label>
          <label>Password<input class="field" name="password" type="password" autocomplete="current-password" required></label>
          <button class="btn" type="submit">Log in</button>
          <button class="line-item__remove" type="button" data-forgot style="justify-self:start">Forgot your password?</button>
          <p class="form-msg" data-login-msg role="alert"></p>
        </form>
        ${signup ? `<form class="form auth-card c-mint" data-signup>
          <h2>New here?</h2>
          <p class="muted" style="margin:0">Make an account to save your address and see your past orders. You can still check out as a guest.</p>
          <label>Your name<input class="field" name="name" autocomplete="name" required maxlength="80"></label>
          <label>Email<input class="field" name="email" type="email" autocomplete="email" required></label>
          <label>Password<input class="field" name="password" type="password" autocomplete="new-password" minlength="8" required>
            <small class="muted">At least 8 characters</small></label>
          <button class="btn btn--teal" type="submit">Create my account</button>
          <p class="form-msg" data-signup-msg role="alert"></p>
        </form>` : ""}
      </div>`;
    const after = () => { location.href = params.get("next") === "checkout" ? "checkout.html" : location.pathname.split("/").pop() || "account.html"; };
    const login = root.querySelector("[data-login]");
    login.addEventListener("submit", async (e) => {
      e.preventDefault();
      const msg = root.querySelector("[data-login-msg]"); msg.textContent = "";
      const { error } = await sb.auth.signInWithPassword({ email: login.email.value.trim(), password: login.password.value });
      if (error) { msg.textContent = error.message === "Invalid login credentials" ? "That email and password don't match. Try again or reset your password." : error.message; return; }
      after();
    });
    root.querySelector("[data-forgot]").addEventListener("click", async () => {
      const msg = root.querySelector("[data-login-msg]");
      const email = login.email.value.trim();
      if (!email) { msg.textContent = "Type your email above first, then click this again."; login.email.focus(); return; }
      const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: location.href.split("?")[0] });
      msg.textContent = error ? error.message : `We've emailed a reset link to ${email}.`;
    });
    const su = root.querySelector("[data-signup]");
    if (su) su.addEventListener("submit", async (e) => {
      e.preventDefault();
      const msg = root.querySelector("[data-signup-msg]"); msg.textContent = "";
      const { data, error } = await sb.auth.signUp({
        email: su.email.value.trim(), password: su.password.value,
        options: { data: { full_name: su.name.value.trim() }, emailRedirectTo: location.href.split("?")[0] },
      });
      if (error) { msg.textContent = error.message; return; }
      if (data.session) { toast("Welcome to Sentimental Apple!", "heart", "pink"); after(); return; }
      su.innerHTML = `<h2>Check your email</h2><p>We've sent a link to <b>${esc(su.email.value)}</b>. Click it to finish making your account, then come back and log in.</p>`;
    });
  }

  // Password reset links land here
  function watchRecovery(SA, root) {
    SA.sb.auth.onAuthStateChange((event) => {
      if (event !== "PASSWORD_RECOVERY") return;
      root.innerHTML = `<form class="form auth-card" data-newpass style="max-width:460px;margin:auto">
        <h2>Choose a new password</h2>
        <label>New password<input class="field" name="password" type="password" minlength="8" required autocomplete="new-password"></label>
        <button class="btn" type="submit">Save new password</button><p class="form-msg" role="alert"></p></form>`;
      const f = root.querySelector("[data-newpass]");
      f.addEventListener("submit", async (e) => {
        e.preventDefault();
        const { error } = await SA.sb.auth.updateUser({ password: f.password.value });
        if (error) { f.querySelector(".form-msg").textContent = error.message; return; }
        SA.toast("Password updated", "heart", "pink"); setTimeout(() => location.reload(), 900);
      });
    });
  }

  const statusPill = (s) => `<span class="status status--${s}">${STATUS[s] || s}</span>`;
  const itemsText = (SA, items) => (items || []).map((i) => `${i.qty} × ${SA.esc(i.name)}`).join(", ");
  const orderDate = (d) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  window.SA_PAGES = {
    // =====================================================
    // MY ACCOUNT
    // =====================================================
    async account(SA) {
      const root = SA.$("[data-account]");
      if (!SA.online || !SA.sb) return offline(SA, root);
      watchRecovery(SA, root);
      const { sb, esc, money, toast, user } = SA;
      if (!user) {
        return authForms(SA, root, { intro: `<div class="page-hero"><h1>Your account</h1><p>Log in to see your orders, or make an account in a few seconds.</p></div>` });
      }
      const [{ data: profile }, { data: orders, error: oErr }] = await Promise.all([
        sb.from("profiles").select("full_name, phone, address").eq("id", user.id).maybeSingle(),
        sb.from("orders").select("number, created_at, total, status, order_items(name, qty)").order("created_at", { ascending: false }),
      ]);
      const name = profile?.full_name || user.email;
      root.innerHTML = `
        <div class="page-hero account-head">
          <div><h1>Hello, ${esc(name.split(" ")[0])}</h1><p>${esc(user.email)}</p></div>
          <div class="hero__ctas" style="margin:0">${SA.isAdmin ? '<a class="btn btn--teal" href="admin.html">Open the shop admin</a>' : ""}<button class="btn btn--plain" type="button" data-logout>Log out</button></div>
        </div>
        <div class="account-grid">
          <section class="auth-card" style="padding:1.6rem">
            <h2>Your orders</h2>
            ${oErr ? `<p>We couldn't load your orders just now.</p>` : orders.length ? orders.map((o) => `
              <div class="admin-row">
                <div class="admin-row__top"><b>Order #${o.number}</b>${statusPill(o.status)}</div>
                <div class="muted">${orderDate(o.created_at)} · ${money(o.total)}</div>
                <div>${itemsText(SA, o.order_items)}</div>
              </div>`).join("") : `<p class="muted">No orders yet. <a class="link" href="shop.html">Find something sweet</a></p>`}
          </section>
          <form class="form auth-card c-mint" data-profile>
            <h2>Your details</h2>
            <p class="muted" style="margin:0">We'll fill these in for you at checkout.</p>
            <label>Name<input class="field" name="full_name" value="${esc(profile?.full_name || "")}" maxlength="80"></label>
            <label>Phone (optional)<input class="field" name="phone" value="${esc(profile?.phone || "")}" maxlength="30" autocomplete="tel"></label>
            <label>Delivery address<textarea class="field" name="address" autocomplete="street-address">${esc(profile?.address || "")}</textarea></label>
            <button class="btn" type="submit">Save my details</button>
          </form>
        </div>`;
      root.querySelector("[data-logout]").addEventListener("click", async () => { await sb.auth.signOut(); location.href = "index.html"; });
      const pf = root.querySelector("[data-profile]");
      pf.addEventListener("submit", async (e) => {
        e.preventDefault();
        const d = Object.fromEntries(new FormData(pf));
        const { error } = await sb.from("profiles").upsert({ id: user.id, ...d });
        toast(error ? "Your details couldn't be saved. Please try again." : "Details saved", error ? "cloud" : "heart", error ? "teal" : "pink");
      });
    },

    // =====================================================
    // SHOP ADMIN (owner only)
    // =====================================================
    async admin(SA) {
      const root = SA.$("[data-admin]");
      if (!SA.online || !SA.sb) return offline(SA, root);
      watchRecovery(SA, root);
      const { sb, esc, money, toast, art, user } = SA;
      if (!user) return authForms(SA, root, { signup: false, intro: `<div class="page-hero"><h1>Shop admin</h1><p>Log in with the shop owner's account.</p></div>` });
      if (!SA.isAdmin) {
        root.innerHTML = `<div class="empty">${art("star", "butter")}<h2>This page is just for the shop owner</h2><p class="muted" style="margin-inline:auto">You're logged in as ${esc(user.email)}.</p><a class="btn" href="index.html">Back to home</a></div>`;
        return;
      }

      root.innerHTML = `
        <div class="page-hero account-head">
          <div><h1>Shop admin</h1><p>Write journal posts, look after notes and keep track of orders.</p></div>
          <a class="btn btn--plain" href="account.html">My account</a>
        </div>
        <div class="tabs" role="tablist" style="margin-bottom:1.5rem">
          <button class="tab" type="button" data-panel="posts" aria-pressed="true">Journal posts</button>
          <button class="tab" type="button" data-panel="notes" aria-pressed="false">Notes</button>
          <button class="tab" type="button" data-panel="orders" aria-pressed="false">Orders</button>
        </div>
        <div data-panel-body></div>`;
      const body = root.querySelector("[data-panel-body]");
      const tabs = root.querySelectorAll("[data-panel]");
      const show = (name) => { tabs.forEach((t) => t.setAttribute("aria-pressed", t.dataset.panel === name)); PANELS[name](); };
      tabs.forEach((t) => t.addEventListener("click", () => show(t.dataset.panel)));

      const slug = (s) => s.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_]+/g, "-").replace(/-+/g, "-").slice(0, 60) || "post";

      const PANELS = {
        // ---------- Journal posts ----------
        async posts() {
          body.innerHTML = `<p class="muted">Loading posts…</p>`;
          const { data: posts, error } = await sb.from("posts").select("*, comments(count)").order("date", { ascending: false });
          if (error) { body.innerHTML = `<p>Couldn't load posts: ${esc(error.message)}</p>`; return; }
          body.innerHTML = `
            <button class="btn" type="button" data-new style="margin-bottom:1.4rem">Write a new post</button>
            <div class="admin-list">${posts.length ? posts.map((p) => `
              <div class="admin-row admin-row--post">
                <div class="admin-thumb c-${p.color}">${p.image ? `<img src="${esc(p.image)}" alt="">` : art(p.icon, p.color)}</div>
                <div>
                  <div class="admin-row__top"><b>${esc(p.title)}</b>${p.published ? statusPill("paid").replace(">Paid<", ">Published<") : `<span class="status status--pending">Draft</span>`}</div>
                  <div class="muted">${orderDate(p.date)} · by ${esc(p.author || "—")} · ♡ ${p.likes} · ${p.comments?.[0]?.count ?? 0} notes</div>
                </div>
                <div class="admin-actions">
                  <a class="btn btn--small btn--plain" href="journal.html?post=${encodeURIComponent(p.id)}" target="_blank" rel="noopener">View</a>
                  <button class="btn btn--small btn--plain" type="button" data-edit="${esc(p.id)}">Edit</button>
                  <button class="btn btn--small btn--plain" type="button" data-del="${esc(p.id)}">Delete</button>
                </div>
              </div>`).join("") : `<p class="muted">No posts yet. Write your first one!</p>`}</div>`;
          body.querySelector("[data-new]").addEventListener("click", () => editor(null, posts));
          body.querySelectorAll("[data-edit]").forEach((b) => b.addEventListener("click", () => editor(posts.find((p) => p.id === b.dataset.edit), posts)));
          body.querySelectorAll("[data-del]").forEach((b) => confirmClick(b, async () => {
            const { error: e } = await sb.from("posts").delete().eq("id", b.dataset.del);
            if (e) { toast("Couldn't delete that post.", "cloud", "teal"); b.disabled = false; return; }
            toast("Post deleted", "sparkle", "butter"); PANELS.posts();
          }));
        },

        // ---------- Notes ----------
        async notes() {
          body.innerHTML = `<p class="muted">Loading notes…</p>`;
          const { data: notes, error } = await sb.from("comments").select("id, name, body, created_at, post_id, posts(title)").order("created_at", { ascending: false }).limit(300);
          if (error) { body.innerHTML = `<p>Couldn't load notes: ${esc(error.message)}</p>`; return; }
          body.innerHTML = `<p class="muted">Newest first. Notes appear on the journal straight away; delete any you don't want there.</p>
            <div class="admin-list">${notes.length ? notes.map((n) => `
              <div class="admin-row">
                <div class="admin-row__top"><b>${esc(n.name)}</b><span class="muted">${orderDate(n.created_at)} · on “${esc(n.posts?.title || n.post_id)}”</span></div>
                <p style="margin:.2rem 0 .6rem">${esc(n.body)}</p>
                <button class="btn btn--small btn--plain" type="button" data-del-note="${n.id}">Delete note</button>
              </div>`).join("") : `<p class="muted">No notes yet.</p>`}</div>`;
          body.querySelectorAll("[data-del-note]").forEach((b) => confirmClick(b, async () => {
            const { error: e } = await sb.from("comments").delete().eq("id", Number(b.dataset.delNote));
            if (e) { toast("Couldn't delete that note.", "cloud", "teal"); b.disabled = false; return; }
            b.closest(".admin-row").remove(); toast("Note deleted", "sparkle", "butter");
          }));
        },

        // ---------- Orders ----------
        async orders(filter = "all") {
          body.innerHTML = `<p class="muted">Loading orders…</p>`;
          let q = sb.from("orders").select("*, order_items(name, qty, price)").order("created_at", { ascending: false }).limit(300);
          if (filter !== "all") q = q.eq("status", filter);
          const { data: orders, error } = await q;
          if (error) { body.innerHTML = `<p>Couldn't load orders: ${esc(error.message)}</p>`; return; }
          const filters = [["all", "All"], ["paid", "To pack"], ["packed", "Packed"], ["shipped", "Shipped"], ["pending", "Not paid yet"], ["cancelled", "Cancelled"]];
          body.innerHTML = `
            <div class="tabs" style="margin-bottom:1.2rem">${filters.map(([k, l]) => `<button class="tab" type="button" data-filter="${k}" aria-pressed="${k === filter}">${l}</button>`).join("")}</div>
            <div class="admin-list">${orders.length ? orders.map((o) => `
              <div class="admin-row">
                <div class="admin-row__top"><b>Order #${o.number}</b>
                  <label class="sr-only" for="st-${o.id}">Status</label>
                  <select class="field status-select" id="st-${o.id}" data-status="${o.id}">${Object.entries(STATUS).map(([k, l]) => `<option value="${k}" ${k === o.status ? "selected" : ""}>${l}</option>`).join("")}</select>
                </div>
                <div class="muted">${new Date(o.created_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })} · ${o.user_id ? "Account customer" : "Guest"}${o.paid_at ? " · paid by card" : ""}</div>
                <div class="order-grid">
                  <div><b>${esc(o.name)}</b><br><a href="mailto:${esc(o.email)}">${esc(o.email)}</a><br><span style="white-space:pre-line">${esc(o.address)}</span>${o.note ? `<br><i>Note: ${esc(o.note)}</i>` : ""}</div>
                  <div>${(o.order_items || []).map((i) => `<div class="summary-row" style="padding:.1rem 0"><span>${i.qty} × ${esc(i.name)}</span><span>${money(i.price * i.qty)}</span></div>`).join("")}
                    <div class="summary-row" style="padding:.1rem 0"><span>Shipping</span><span>${Number(o.shipping) ? money(o.shipping) : "Free"}</span></div>
                    <div class="summary-row summary-row--total" style="font-size:1rem"><span>Total</span><span>${money(o.total)}</span></div></div>
                </div>
              </div>`).join("") : `<p class="muted">No orders here.</p>`}</div>`;
          body.querySelectorAll("[data-filter]").forEach((b) => b.addEventListener("click", () => PANELS.orders(b.dataset.filter)));
          body.querySelectorAll("[data-status]").forEach((s) => s.addEventListener("change", async () => {
            const { error: e } = await sb.from("orders").update({ status: s.value }).eq("id", s.dataset.status);
            toast(e ? "Couldn't update that order." : `Order marked as ${STATUS[s.value].toLowerCase()}`, e ? "cloud" : "envelope", e ? "teal" : "mint");
          }));
        },
      };

      // ---------- Post editor ----------
      function editor(post, all) {
        const p = post || { title: "", date: new Date().toISOString().slice(0, 10), author: "", tags: [], icon: "notebook", color: "teal", body: "", image: "", published: true };
        let photo = p.image || "", file = null;
        body.innerHTML = `
          <form class="form auth-card editor" data-editor>
            <h2>${post ? "Edit post" : "New post"}</h2>
            <label>Title<input class="field" name="title" value="${esc(p.title)}" required maxlength="120"></label>
            <div class="editor-row">
              <label>Date<input class="field" type="date" name="date" value="${esc(p.date)}" required></label>
              <label>Written by<input class="field" name="author" value="${esc(p.author)}" maxlength="60"></label>
            </div>
            <label>Tags <small class="muted">separate with commas, e.g. journalling, how-to</small><input class="field" name="tags" value="${esc((p.tags || []).join(", "))}"></label>
            <fieldset class="editor-photo">
              <legend>Polaroid picture</legend>
              <div class="editor-photo__preview c-${p.color}" data-preview></div>
              <div class="form">
                <label>Upload a photo <small class="muted">(JPG or PNG, under 5 MB)</small><input class="field" type="file" name="photo" accept="image/*"></label>
                <button class="btn btn--small btn--plain" type="button" data-remove-photo ${photo ? "" : "hidden"}>Remove photo</button>
                <p class="muted" style="margin:0">No photo? We'll show a cute drawing instead:</p>
                <div class="editor-row">
                  <label>Drawing<select class="field" name="icon">${ICONS.map((i) => `<option ${i === p.icon ? "selected" : ""}>${i}</option>`).join("")}</select></label>
                  <label>Colour<select class="field" name="color">${COLORS.map((c) => `<option ${c === p.color ? "selected" : ""}>${c}</option>`).join("")}</select></label>
                </div>
              </div>
            </fieldset>
            <label>Your post <small class="muted">leave an empty line between paragraphs</small><textarea class="field" name="body" required style="min-height:260px">${esc(p.body)}</textarea></label>
            <label class="check"><input type="checkbox" name="published" ${p.published ? "checked" : ""}> Show this post on the journal (untick to keep it as a draft)</label>
            <div class="hero__ctas" style="margin:0"><button class="btn" type="submit">${post ? "Save changes" : "Publish post"}</button><button class="btn btn--plain" type="button" data-cancel>Cancel</button></div>
            <p class="form-msg" data-editor-msg role="alert"></p>
          </form>`;
        const f = body.querySelector("[data-editor]");
        const preview = () => {
          const box = f.querySelector("[data-preview]");
          box.className = `editor-photo__preview c-${f.color.value}`;
          box.innerHTML = photo ? `<img src="${esc(photo)}" alt="Photo preview">` : art(f.icon.value, f.color.value);
          f.querySelector("[data-remove-photo]").hidden = !photo;
        };
        preview();
        f.icon.addEventListener("change", preview); f.color.addEventListener("change", preview);
        f.photo.addEventListener("change", () => {
          file = f.photo.files[0] || null;
          if (file && file.size > 5 * 1024 * 1024) { f.querySelector("[data-editor-msg]").textContent = "That photo is too big. Please choose one under 5 MB."; f.photo.value = ""; file = null; return; }
          if (file) photo = URL.createObjectURL(file);
          preview();
        });
        f.querySelector("[data-remove-photo]").addEventListener("click", () => { photo = ""; file = null; f.photo.value = ""; preview(); });
        f.querySelector("[data-cancel]").addEventListener("click", () => PANELS.posts());
        f.addEventListener("submit", async (e) => {
          e.preventDefault();
          const msg = f.querySelector("[data-editor-msg]"); msg.textContent = "";
          const btn = f.querySelector('button[type="submit"]'); btn.disabled = true; btn.textContent = "Saving…";
          try {
            let id = post?.id;
            if (!id) {
              const base = slug(f.title.value); id = base;
              for (let n = 2; all.some((x) => x.id === id); n++) id = `${base}-${n}`;
            }
            let image = photo.startsWith("blob:") ? "" : photo;
            if (file) {
              const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
              const path = `${id}/${Date.now()}.${ext}`;
              const { error: upErr } = await sb.storage.from("journal").upload(path, file, { contentType: file.type, cacheControl: "31536000" });
              if (upErr) throw new Error("The photo couldn't be uploaded: " + upErr.message);
              image = sb.storage.from("journal").getPublicUrl(path).data.publicUrl;
            }
            const row = {
              id, title: f.title.value.trim(), date: f.date.value, author: f.author.value.trim(),
              tags: f.tags.value.split(",").map((t) => t.trim()).filter(Boolean),
              icon: f.icon.value, color: f.color.value, body: f.body.value.trim(), image: image || null,
              published: f.published.checked,
            };
            const { error: saveErr } = await sb.from("posts").upsert(row);
            if (saveErr) throw new Error(saveErr.message);
            toast(post ? "Post saved" : row.published ? "Post published" : "Draft saved", "heart", "pink");
            PANELS.posts();
          } catch (err) {
            msg.textContent = err.message || "Something went wrong. Please try again.";
            btn.disabled = false; btn.textContent = post ? "Save changes" : "Publish post";
          }
        });
      }

      show("posts");
    },
  };
})();
