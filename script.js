/* ==========================================================
   EDIT YOUR INVITATION DETAILS HERE
   Dates use: YYYY-MM-DDTHH:MM:SS (24-hour time).
   Use your local time zone for the event time.
   (Guardians' names are edited directly in index.html,
    inside the <div class="guardians"> block.)
   ========================================================== */
const INVITATION = {
  wedding: {
    date: "2026-11-13T19:00:00", // CHANGE to your Nikah date and time
    displayDate: "FRIDAY, 13 NOVEMBER 2026", // CHANGE the displayed date
    time: "7:00 PM onwards", // CHANGE the displayed time
    venue: "Vijay Banquet Hall, Tagore Nagar, Vikhroli (East)", // CHANGE venue
    mapUrl: "https://maps.app.goo.gl/gNDi94Xdgt188Tyx9", // CHANGE map search/link
  },
  // reception: {
  //   date: "2026-11-14T20:00:00", // CHANGE to your reception date and time
  //   displayDate: "SATURDAY, 14 NOVEMBER 2026", // CHANGE the displayed date
  //   time: "8:00 PM onwards", // CHANGE the displayed time
  //   venue: "Reception Venue Name, Street / Area, City", // CHANGE venue
  //   mapUrl: "https://maps.google.com/?q=Reception+Venue+Name", // CHANGE map search/link
  // },
};

// Opening doors
// true  = show the doors when the page loads
// false = skip them and show the invitation immediately
const SHOW_CURTAIN = true;

// Enable animation styles only when JavaScript is running, so content remains readable if scripts fail.
document.documentElement.classList.add("js-enabled");

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

/* ---------------- always start from the top ---------------- */
// Stop the browser from restoring the old scroll position on reload/back.
if ("scrollRestoration" in history) history.scrollRestoration = "manual";

// Jump to the top instantly, bypassing the CSS `scroll-behavior: smooth`
// for this one jump only. Other smooth scrolling is unaffected.
function jumpToTop() {
  const root = document.documentElement;
  const previous = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  window.scrollTo(0, 0);
  root.style.scrollBehavior = previous;
}

jumpToTop();
// Also covers mobile browsers restoring the page from their back/forward cache.
window.addEventListener("pageshow", jumpToTop);

/* ---------------- details & countdowns ---------------- */
function fill(selector, value) {
  document.querySelectorAll(selector).forEach((el) => {
    el.textContent = value;
  });
}
function applyDetails() {
  fill("[data-wedding-date]", INVITATION.wedding.displayDate);
  fill("[data-wedding-time]", INVITATION.wedding.time);
  fill("[data-wedding-venue]", INVITATION.wedding.venue);
  // fill("[data-reception-date]", INVITATION.reception.displayDate);
  // fill("[data-reception-time]", INVITATION.reception.time);
  // fill("[data-reception-venue]", INVITATION.reception.venue);
  document.getElementById("weddingMap").href = INVITATION.wedding.mapUrl;
  // document.getElementById("receptionMap").href = INVITATION.reception.mapUrl;
}
function updateCountdown(elementId, dateString) {
  const root = document.getElementById(elementId);
  const target = new Date(dateString).getTime();
  if (Number.isNaN(target)) {
    root.innerHTML = "<p>Please set a valid event date in script.js</p>";
    return;
  }
  const distance = target - Date.now();
  if (distance <= 0) {
    root.innerHTML =
      '<p class="countdown-finished">The day is here — Alhamdulillah!</p>';
    return;
  }
  const values = [
    [Math.floor(distance / 86400000), "Days"],
    [Math.floor((distance % 86400000) / 3600000), "Hours"],
    [Math.floor((distance % 3600000) / 60000), "Mins"],
    [Math.floor((distance % 60000) / 1000), "Secs"],
  ];
  root.innerHTML = values
    .map(
      ([number, label]) =>
        `<span><b>${String(number).padStart(2, "0")}</b><small>${label}</small></span>`,
    )
    .join("");
}
function tickCountdowns() {
  updateCountdown("weddingCountdown", INVITATION.wedding.date);
  // updateCountdown("receptionCountdown", INVITATION.reception.date);
}

/* ---------------- floral side motifs ---------------- */
// Adds a climbing vine to the left and right edge of every section.
// Alternate sections swap which side sits high and which sits low.
function addSideMotifs() {
  const vine =
    '<svg viewBox="0 0 120 340" focusable="false"><use href="#vine"/></svg>';
  document.querySelectorAll(".section-shell").forEach((section, index) => {
    if (index % 2) section.classList.add("motif-alt");
    ["left", "right"].forEach((side) => {
      const motif = document.createElement("div");
      motif.className = `motif motif-${side}`;
      motif.setAttribute("aria-hidden", "true");
      motif.innerHTML = vine;
      section.prepend(motif);
    });
  });
}

/* ---------------- opening doors ---------------- */
const curtainScreen = document.getElementById("curtainScreen");

function revealHero() {
  document.querySelectorAll(".hero .reveal").forEach((el, index) => {
    window.setTimeout(() => el.classList.add("visible"), 500 + index * 110);
  });
}

function showerPetals() {
  if (prefersReducedMotion) return;
  const colours = ["#e5c4b5", "#efd3c6", "#dcc69e", "#f3e3cf", "#d9b4a4"];
  const layer = document.createElement("div");
  layer.className = "petal-layer";
  layer.setAttribute("aria-hidden", "true");
  const count = window.innerWidth < 600 ? 22 : 34;
  for (let i = 0; i < count; i += 1) {
    const petal = document.createElement("span");
    petal.className = "petal";
    const size = 9 + Math.random() * 9;
    petal.style.setProperty("--x", `${Math.random() * 100}vw`);
    petal.style.setProperty("--s", `${size}px`);
    petal.style.setProperty("--d", `${4.2 + Math.random() * 3}s`);
    petal.style.setProperty("--delay", `${0.4 + Math.random() * 1.8}s`);
    petal.style.setProperty("--r", `${Math.random() * 360}deg`);
    petal.style.setProperty("--drift", `${(Math.random() - 0.5) * 140}px`);
    petal.style.setProperty("--c", colours[i % colours.length]);
    layer.appendChild(petal);
  }
  document.body.appendChild(layer);
  window.setTimeout(() => layer.remove(), 10000);
}

function skipCurtain() {
  jumpToTop(); 
  curtainScreen.hidden = true;
  document.body.classList.remove("is-locked");
  revealHero();
}

function openInvitation() {
  if (curtainScreen.hidden || curtainScreen.classList.contains("open")) return;

  if (prefersReducedMotion) {
    skipCurtain();
    return;
  }

  curtainScreen.classList.add("open");
  jumpToTop(); 
  document.body.classList.remove("is-locked");
  revealHero();
  showerPetals();

  // Doors finish swinging at ~2.35s; then fade the overlay away.
  window.setTimeout(() => curtainScreen.classList.add("done"), 2000);
  window.setTimeout(() => {
    curtainScreen.hidden = true;
  }, 2900);
}

// Apply the setting configured at the top of script.js.
if (SHOW_CURTAIN) {
  document.body.classList.add("is-locked");
} else {
  skipCurtain();
}

document
  .getElementById("openInvitation")
  .addEventListener("click", openInvitation);

// Tapping anywhere on the doors also opens them.
curtainScreen.addEventListener("click", (event) => {
  if (!event.target.closest(".curtain-card")) openInvitation();
});

document
  .getElementById("backToTop")
  .addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" }),
  );

/* ---------------- scroll reveal ---------------- */
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.01, rootMargin: "0px 0px -4% 0px" },
  );
  document
    .querySelectorAll(".reveal:not(.hero .reveal)")
    .forEach((el) => revealObserver.observe(el));
} else {
  // Older browsers: keep all sections visible rather than hiding the invitation.
  document
    .querySelectorAll(".reveal")
    .forEach((el) => el.classList.add("visible"));
}

addSideMotifs();
applyDetails();
tickCountdowns();
window.setInterval(tickCountdowns, 1000);
