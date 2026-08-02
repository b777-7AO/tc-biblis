// Renders CMS-managed content from /content/*.json into the pages.
// Progressive enhancement: the static HTML stays as a fallback; these
// functions only override it once the JSON has loaded successfully.
(function () {
  "use strict";

  const esc = (s) =>
    String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  async function load(path) {
    try {
      const res = await fetch(path, { cache: "no-store" });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null; // keep the static fallback
    }
  }

  const dotted = (obj, key) =>
    key.split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj);

  function telHref(phone) {
    const digits = String(phone || "").replace(/[^\d+]/g, "");
    return digits ? "tel:" + digits : "";
  }

  // News date: accept an ISO date (from the CMS date picker) and derive the
  // big day number + "Monat JJ" label; fall back to manual day/month fields.
  const MONTHS_DE = ["Jan", "Feb", "März", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
  function newsDateParts(n) {
    const m = String(n.date || "").match(/(\d{4})-(\d{2})-(\d{2})/);
    if (m) return { d: m[3], m: MONTHS_DE[parseInt(m[2], 10) - 1] + " " + m[1].slice(-2) };
    return { d: n.day || "", m: n.month || "" };
  }

  // ── Generic text + image binding ────────────────────────────────
  // [data-cms="page.key"]      -> textContent
  // [data-cms-html="page.key"] -> innerHTML (allows <br> etc.)
  // [data-cms-img="slot"]      -> <img> src
  // [data-cms-bg="slot"]       -> CSS --ph variable (background photos)
  async function bindTextsAndImages() {
    const [texts, images] = await Promise.all([
      load("content/texts.json"),
      load("content/images.json"),
    ]);

    if (texts) {
      document.querySelectorAll("[data-cms]").forEach((el) => {
        const v = dotted(texts, el.getAttribute("data-cms"));
        if (v != null && v !== "") el.textContent = v;
      });
      document.querySelectorAll("[data-cms-html]").forEach((el) => {
        const v = dotted(texts, el.getAttribute("data-cms-html"));
        if (v != null && v !== "") el.innerHTML = v;
      });
    }

    if (images) {
      document.querySelectorAll("[data-cms-img]").forEach((el) => {
        const v = images[el.getAttribute("data-cms-img")];
        if (v) el.setAttribute("src", v);
      });
      document.querySelectorAll("[data-cms-bg]").forEach((el) => {
        const v = images[el.getAttribute("data-cms-bg")];
        // absolute URL: Chrome resolves relative url() in custom properties
        // against the stylesheet folder, not the document, and 404s
        if (v) el.style.setProperty("--ph", `url('${new URL(v, document.baseURI).href}')`);
      });
    }
  }

  // Fix the no-JS inline fallbacks the same way (runs before JSON loads)
  document.querySelectorAll("[data-cms-bg]").forEach((el) => {
    const m = (el.getAttribute("style") || "").match(/--ph:\s*url\(['"]?([^'")]+)['"]?\)/);
    if (m) el.style.setProperty("--ph", `url('${new URL(m[1], document.baseURI).href}')`);
  });

  // ── News (homepage) ─────────────────────────────────────────────
  async function renderNews() {
    const mount = document.getElementById("news-list");
    if (!mount) return;
    const data = await load("content/news.json");
    if (!data || !Array.isArray(data.items) || !data.items.length) return;
    // newest first when dates are present
    const items = data.items.slice().sort((a, b) =>
      String(b.date || "").localeCompare(String(a.date || "")));
    mount.innerHTML = items
      .map((n) => {
        const dt = newsDateParts(n);
        return `
        <div class="news-item">
          <div class="news-date"><div class="d">${esc(dt.d)}</div><div class="m">${esc(dt.m)}</div></div>
          <div>
            <h3>${esc(n.title)}</h3>
            <p>${esc(n.text)}</p>
          </div>
        </div>`;
      })
      .join("");
  }

  // ── Trainers (trainerteam.html) ─────────────────────────────────
  async function renderTrainers() {
    const mount = document.getElementById("trainer-grid");
    if (!mount) return;
    const data = await load("content/trainers.json");
    if (!data || !Array.isArray(data.items) || !data.items.length) return;
    const people = data.items
      .map((t) => {
        const mail = t.email
          ? `<a href="mailto:${esc(t.email)}">${esc(t.email)}</a>`
          : "";
        const tel = t.phone
          ? `<a href="${esc(telHref(t.phone))}">${esc(t.phone)}</a>`
          : "";
        const contact = [mail, tel].filter(Boolean).join("<br>");
        return `
        <div class="person">
          <div class="avatar">${esc(t.initials)}</div>
          <div class="role">${esc(t.role)}</div>
          <div class="name">${esc(t.name)}</div>
          ${contact}
        </div>`;
      })
      .join("");
    const lvt = `
      <div class="person" style="display:grid;place-content:center;background:rgba(31,122,61,.06);border-style:dashed;">
        <div class="role" style="color:var(--muted)">In Kooperation mit</div>
        <div class="name">Tennisschule LVT</div>
        <p style="font-size:.88rem;color:var(--muted);margin:0;">Kennenlernwochen &amp; Jugendförderung</p>
      </div>`;
    mount.innerHTML = people + lvt;
  }

  // ── Board (vorstand.html) ───────────────────────────────────────
  async function renderBoard() {
    const mount = document.getElementById("board-grid");
    if (!mount) return;
    const data = await load("content/board.json");
    if (!data || !Array.isArray(data.items) || !data.items.length) return;
    mount.innerHTML = data.items
      .map((m) => {
        const mail = m.email
          ? `<a href="mailto:${esc(m.email)}">${esc(m.email)}</a>`
          : "";
        return `
        <div class="person${m.vacant ? " vacant" : ""}">
          <div class="avatar">${esc(m.initials)}</div>
          <div class="role">${esc(m.role)}</div>
          <div class="name">${esc(m.name)}</div>
          ${mail}
        </div>`;
      })
      .join("");
  }

  bindTextsAndImages();
  renderNews();
  renderTrainers();
  renderBoard();
})();
