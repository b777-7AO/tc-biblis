// Renders CMS-managed content (news, trainers, board) from /content/*.json.
// Progressive enhancement: the static HTML in each page stays as a fallback;
// these functions only replace it once the JSON has loaded successfully.
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

  function telHref(phone) {
    const digits = String(phone || "").replace(/[^\d+]/g, "");
    return digits ? "tel:" + digits : "";
  }

  // ---- News (homepage) ----
  async function renderNews() {
    const mount = document.getElementById("news-list");
    if (!mount) return;
    const data = await load("content/news.json");
    if (!data || !Array.isArray(data.items) || !data.items.length) return;
    mount.innerHTML = data.items
      .map(
        (n) => `
        <div class="news-item">
          <div class="news-date"><div class="d">${esc(n.day)}</div><div class="m">${esc(n.month)}</div></div>
          <div>
            <h3>${esc(n.title)}</h3>
            <p>${esc(n.text)}</p>
          </div>
        </div>`
      )
      .join("");
  }

  // ---- Trainers (trainerteam.html) ----
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
    // Keep the LVT cooperation tile as the final card.
    const lvt = `
      <div class="person" style="display:grid;place-content:center;background:rgba(31,122,61,.06);border-style:dashed;">
        <div class="role" style="color:var(--muted)">In Kooperation mit</div>
        <div class="name">Tennisschule LVT</div>
        <p style="font-size:.88rem;color:var(--muted);margin:0;">Kennenlernwochen &amp; Jugendförderung</p>
      </div>`;
    mount.innerHTML = people + lvt;
  }

  // ---- Board (vorstand.html) ----
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

  renderNews();
  renderTrainers();
  renderBoard();
})();
