// Shared nav + footer injection and interactions for TC Biblis
(function () {
  // Central address that every website inquiry is delivered to.
  const INQUIRY_EMAIL = "ojdegen@gmail.com";
  const NAV = [
    { href: "index.html", label: "Start" },
    { href: "anlage.html", label: "Anlage" },
    { href: "tennishalle.html", label: "Tennishalle" },
    { href: "trainingszeiten.html", label: "Training" },
    { href: "trainerteam.html", label: "Trainerteam" },
    { href: "jugend.html", label: "Jugend" },
    { href: "mannschaften.html", label: "Mannschaften" },
    { href: "vorstand.html", label: "Vorstand" },
    { href: "historie.html", label: "Historie" },
    { href: "werbepartner.html", label: "Partner" },
  ];

  const current = location.pathname.split("/").pop() || "index.html";

  function header() {
    const links = NAV.map(
      (n) =>
        `<a href="${n.href}"${n.href === current ? ' class="active"' : ""}>${n.label}</a>`
    ).join("");
    return `
    <header class="site-header">
      <div class="container nav">
        <a class="brand" href="index.html">
          <img class="brand-mark" src="assets/img/logo.png" alt="TC Biblis 1973 e.V. Logo" width="44" height="44">
          <span>TC Biblis<small>1973 e.V.</small></span>
        </a>
        <button class="nav-toggle" aria-label="Menü" aria-expanded="false"><span></span></button>
        <nav class="nav-links">
          ${links}
          <a class="nav-cta" href="mitgliedschaft.html">Mitglied werden</a>
        </nav>
      </div>
    </header>`;
  }

  function footer() {
    const cols = [
      {
        h: "Verein",
        items: [
          ["index.html", "Start"],
          ["anlage.html", "Anlage"],
          ["historie.html", "Historie"],
          ["vorstand.html", "Vorstand"],
          ["werbepartner.html", "Werbepartner"],
        ],
      },
      {
        h: "Tennis",
        items: [
          ["tennishalle.html", "Tennishalle"],
          ["trainingszeiten.html", "Trainingszeiten"],
          ["trainerteam.html", "Trainerteam"],
          ["jugend.html", "Jugend"],
          ["mannschaften.html", "Mannschaften"],
        ],
      },
      {
        h: "Rechtliches",
        items: [
          ["mitgliedschaft.html", "Mitgliedschaft"],
          ["impressum.html", "Impressum"],
          ["datenschutz.html", "Datenschutz"],
        ],
      },
    ];
    const colHtml = cols
      .map(
        (c) =>
          `<div><h4>${c.h}</h4><ul>${c.items
            .map((i) => `<li><a href="${i[0]}">${i[1]}</a></li>`)
            .join("")}</ul></div>`
      )
      .join("");
    return `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <div class="footer-brand"><img class="brand-mark on-dark" src="assets/img/logo.png" alt="TC Biblis 1973 e.V. Logo" width="44" height="44"> TC Biblis 1973 e.V.</div>
            <p style="font-size:.92rem;line-height:1.7;">Josef-Seib-Straße 7–9<br>68647 Biblis</p>
            <p style="font-size:.92rem;"><a href="mailto:geschaeftsstelle@tc-biblis.de">geschaeftsstelle@tc-biblis.de</a></p>
          </div>
          ${colHtml}
        </div>
        <div class="footer-bottom">
          <span>© ${1973}–2026 TC Biblis 1973 e.V. · Alle Rechte vorbehalten.</span>
          <span><a href="impressum.html">Impressum</a> · <a href="datenschutz.html">Datenschutz</a></span>
        </div>
      </div>
    </footer>`;
  }

  // Inject
  const headerMount = document.getElementById("site-header");
  const footerMount = document.getElementById("site-footer");
  if (headerMount) headerMount.innerHTML = header();
  if (footerMount) footerMount.innerHTML = footer();

  // Mobile toggle
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => links.classList.remove("open"))
    );
  }

  // Inject scroll-progress bar + back-to-top button
  const bar = document.createElement("div");
  bar.className = "scroll-progress";
  document.body.appendChild(bar);

  const toTop = document.createElement("button");
  toTop.className = "to-top";
  toTop.setAttribute("aria-label", "Nach oben");
  toTop.innerHTML = "↑";
  toTop.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );
  document.body.appendChild(toTop);

  function onScroll() {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
    bar.style.width = pct + "%";
    toTop.classList.toggle("show", h.scrollTop > 500);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Animated count-up for hero stats / any [data-count]
  function animateCount(el) {
    const raw = el.textContent.trim();
    const m = raw.match(/^(\d+)(.*)$/);
    if (!m) return;
    const target = parseInt(m[1], 10);
    const suffix = m[2] || "";
    const dur = 1100;
    let start = null;
    function step(ts) {
      if (start === null) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  const counters = document.querySelectorAll(".hero-stats .num");
  if (counters.length) {
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            animateCount(e.target);
            cio.unobserve(e.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((c) => cio.observe(c));
  }

  // Inquiry forms -> deliver to INQUIRY_EMAIL via the visitor's mail client
  document.querySelectorAll("form[data-inquiry]").forEach((form) => {
    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const data = new FormData(form);
      const subject =
        (form.getAttribute("data-inquiry") || "Anfrage") + " – TC Biblis Website";
      const lines = [];
      data.forEach((val, key) => {
        if (String(val).trim()) lines.push(key + ": " + val);
      });
      lines.push("", "— gesendet über tc-biblis.de");
      const href =
        "mailto:" +
        INQUIRY_EMAIL +
        "?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(lines.join("\n"));
      const done = form.querySelector(".form-done");
      if (done) done.style.display = "block";
      window.location.href = href;
    });
  });

  // Any element with [data-inquiry-link] becomes a mailto to INQUIRY_EMAIL
  document.querySelectorAll("[data-inquiry-link]").forEach((a) => {
    const subj = a.getAttribute("data-inquiry-link") || "Anfrage";
    a.setAttribute(
      "href",
      "mailto:" + INQUIRY_EMAIL + "?subject=" + encodeURIComponent(subj + " – TC Biblis Website")
    );
  });

  // Scroll reveal
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
})();
