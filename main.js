/* =========================================================
   BACKGROUND EFFECTS - Particles and Orbs
   ========================================================= */

// Generate floating particles
function generateParticles() {
  const container = document.getElementById('particlesContainer');
  if (!container) return;

  const particleCount = 40;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.animationDelay = `${Math.random() * 20}s`;
    particle.style.animationDuration = `${Math.random() * 10 + 15}s`;
    container.appendChild(particle);
  }
}

// Mouse interaction for orbs
function initOrbInteraction() {
  const orbs = document.querySelectorAll('.orb');
  if (!orbs.length) return;

  let mouseTimer;
  document.addEventListener('mousemove', (e) => {
    if (!mouseTimer) {
      mouseTimer = setTimeout(() => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        orbs.forEach((orb, index) => {
          const speed = (index + 1) * 0.015;
          const x = (mouseX - window.innerWidth / 2) * speed;
          const y = (mouseY - window.innerHeight / 2) * speed;
          orb.style.transform = `translate(${x}px, ${y}px)`;
        });

        mouseTimer = null;
      }, 16); // ~60fps
    }
  });
}

// Initialize background effects
generateParticles();
initOrbInteraction();

/* =========================================================
   Helpers - shorthand selectors for cleaner code
   ========================================================= */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/* =========================================================
   Nav sizing → CSS var (for scroll offsets)
   ========================================================= */
const nav = $("nav");

function setNavHeightVar() {
  const h = nav?.offsetHeight || 0;
  document.documentElement.style.setProperty("--nav-h", `${h}px`);
}
window.addEventListener("resize", setNavHeightVar);

/* =========================================================
   Sticky / auto-hide nav
   ========================================================= */
let prevScrollY = window.pageYOffset || document.documentElement.scrollTop;

function handleStickyNav() {
  if (!nav) return;

  const currScrollY =
    window.pageYOffset || document.documentElement.scrollTop;

  // Get the home section height to determine when to change nav background
  const homeSection = document.getElementById('home');
  const homeHeight = homeSection ? homeSection.offsetHeight : window.innerHeight;

  // Toggle solid background based on scroll position
  if (currScrollY > homeHeight - 100) {
    nav.classList.add("nav-solid");
  } else {
    nav.classList.remove("nav-solid");
  }

  prevScrollY = currScrollY;
}

/* =========================================================
   Mobile menu toggle
   ========================================================= */
const hamburgerMenu = $("#hamburger-menu");
const navLinksUL = $("#nav-links");

function closeMobileMenu() {
  navLinksUL?.classList.remove("nav-active");
  hamburgerMenu?.classList.remove("toggle");
  document.body.classList.remove("nav-open");
  if (hamburgerMenu) hamburgerMenu.setAttribute("aria-expanded", "false");
}

function openMobileMenu() {
  navLinksUL?.classList.add("nav-active");
  hamburgerMenu?.classList.add("toggle");
  document.body.classList.add("nav-open");
  if (hamburgerMenu) hamburgerMenu.setAttribute("aria-expanded", "true");
}

function toggleMobileMenu() {
  const isOpen = navLinksUL?.classList.contains("nav-active");
  isOpen ? closeMobileMenu() : openMobileMenu();
}

if (hamburgerMenu && navLinksUL) {
  hamburgerMenu.addEventListener("click", toggleMobileMenu);

  window.addEventListener("resize", () => {
    if (window.innerWidth > 880 && navLinksUL.classList.contains("nav-active")) {
      closeMobileMenu();
    }
  });
}

/* =========================================================
   Smooth scroll + URL / active-link sync
   ========================================================= */
const navItems = $$(".nav-links a:not(.resume-link)");

function setActiveLinkById(id) {
  navItems.forEach((a) => {
    const match = a.getAttribute("href") === `#${id}`;
    a.classList.toggle("active", match);
    if (match) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
}

function setURLForSection(id) {
  // Keep current path/query, just adjust hash for clean URLs even if deployed in a subfolder
  const base = window.location.pathname + window.location.search;
  const newURL = id === "home" ? base : `${base}#${id}`;
  const current = base + window.location.hash;

  if (current !== newURL) history.replaceState(null, "", newURL);
}

function scrollToSection(id) {
  if (id === "home") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  const target = document.getElementById(id);
  const navH = nav?.offsetHeight || 0;

  if (!target) return;
  const top =
    target.getBoundingClientRect().top + window.pageYOffset - navH;

  window.scrollTo({ top, behavior: "smooth" });
}

navItems.forEach((a) => {
  a.addEventListener("click", (e) => {
    e.preventDefault();

    const id = a.getAttribute("href").slice(1);

    // smooth scroll
    scrollToSection(id);

    // update URL + active
    setURLForSection(id);
    setActiveLinkById(id);

    // close mobile menu
    if (window.innerWidth <= 880) closeMobileMenu();
  });
});

/* =========================================================
   IntersectionObserver: set URL + active on scroll
   ========================================================= */
const sections = $$("main > section[id]");

function observeSections() {
  const navH = nav?.offsetHeight || 0;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          setURLForSection(id);
          setActiveLinkById(id);
        }
      });
    },
    {
      // push the top boundary down by nav height, and bottom up a bit
      rootMargin: `-${navH + 1}px 0px -55% 0px`,
      threshold: 0.1,
    }
  );

  sections.forEach((sec) => io.observe(sec));
}

/* =========================================================
   Initial deep link + history navigation
   ========================================================= */
function handleDeepLinkOnLoad() {
  const id = window.location.hash ? window.location.hash.slice(1) : "home";
  // ensure correct active link immediately
  setActiveLinkById(id);
  // scroll there (use instant jump if loading with a hash)
  if (id !== "home") {
    const navH = nav?.offsetHeight || 0;
    const target = document.getElementById(id);
    if (target) {
      const top =
        target.getBoundingClientRect().top + window.pageYOffset - navH;
      window.scrollTo({ top });
    }
  }
}

window.addEventListener("popstate", () => {
  const id = window.location.hash ? window.location.hash.slice(1) : "home";
  scrollToSection(id);
});

/* =========================================================
   Scroll arrow → About
   ========================================================= */
const scrollArrow = $("#scroll-arrow");
const aboutSection = $("#about");

if (scrollArrow && aboutSection) {
  scrollArrow.addEventListener("click", () => {
    scrollToSection("about");
  });
}

/* =========================================================
   Fade-ins
   ========================================================= */
function initFadeIns() {
  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("fade-in-visible");
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  [
    ".avatar-container",
    ".home-content",
    ".scroll-arrow-container",
    ".about-wrapper",
    ".projects-row",
    ".contact-container",
  ].forEach((sel) => $$(sel).forEach((el) => io.observe(el)));
}

/* =========================================================
   Contact form (Netlify)
   ========================================================= */
function initNetlifyForm() {
  const form = $(".contact-form");
  const statusEl = $("#form-status");

  if (!form || !statusEl) return;

  const encode = (data) =>
    Object.keys(data)
      .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(data[k]))
      .join("&");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // honeypot (bots)
    const hp = form.querySelector('[name="bot-field"]');
    if (hp && hp.value) {
      // quietly ignore
      return;
    }

    // gather
    const data = { "form-name": form.getAttribute("name") || "contact" };
    form.querySelectorAll("input, textarea").forEach((el) => {
      if (el.name && el.type !== "submit") data[el.name] = el.value;
    });

    // POST to Netlify
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encode(data),
    })
      .then(() => {
        form.reset();
        statusEl.textContent = "Thank you! Your message has been sent.";
        statusEl.classList.remove("error");
        statusEl.classList.add("success");
      })
      .catch((err) => {
        console.error(err);
        statusEl.textContent =
          "Oops! Something went wrong. Please try again later.";
        statusEl.classList.remove("success");
        statusEl.classList.add("error");
      });
  });
}



/* =========================================================
   Circular Progress Bars for Languages
   ========================================================= */
function initCircularProgress() {
  const progressBars = document.querySelectorAll(".circular-progress");
  if (!progressBars.length) return;

  const circumference = 2 * Math.PI * 52; // radius = 52

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const percentage = parseInt(el.dataset.percentage) || 0;
          const circle = el.querySelector(".progress-ring-circle");
          const textEl = el.querySelector(".percentage-text");

          // Animate the ring
          const offset = circumference - (percentage / 100) * circumference;
          circle.style.strokeDashoffset = offset;

          // Animate the number counter with easing (slower at end)
          const duration = 1500;
          const startTime = performance.now();

          function easeOutQuart(t) {
            return 1 - Math.pow(1 - t, 4);
          }

          function countUp(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutQuart(progress);
            const current = Math.round(easedProgress * percentage);

            textEl.textContent = current + "%";

            if (progress < 1) {
              requestAnimationFrame(countUp);
            }
          }
          requestAnimationFrame(countUp);

          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  progressBars.forEach((bar) => observer.observe(bar));
}

/* =========================================================
   Boot
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  setNavHeightVar();
  handleStickyNav();
  observeSections();
  handleDeepLinkOnLoad();
  initFadeIns();
  initNetlifyForm();
  initCircularProgress();
});

window.addEventListener("scroll", () => {
  handleStickyNav();
});