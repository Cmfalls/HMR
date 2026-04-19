const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("#site-nav");
const slides = Array.from(document.querySelectorAll(".hero-slide"));
const dots = Array.from(document.querySelectorAll(".hero-dot"));
const tabs = Array.from(document.querySelectorAll(".capability-tab"));
const panels = Array.from(document.querySelectorAll(".capability-panel"));
const inquiryForm = document.querySelector("[data-inquiry-form]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function setHeaderState() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 18);
}

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

if (menuToggle && nav && header) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    nav.classList.toggle("is-open", !isOpen);
    header.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("nav-open", !isOpen);
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      menuToggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
      header.classList.remove("is-open");
      document.body.classList.remove("nav-open");
    }
  });
}

let activeSlide = 0;
let heroTimer;

function showSlide(index) {
  if (!slides.length) return;
  activeSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === activeSlide);
  });
  dots.forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === activeSlide);
  });
}

function startHeroRotation() {
  if (reducedMotion || slides.length < 2) return;
  window.clearInterval(heroTimer);
  heroTimer = window.setInterval(() => showSlide(activeSlide + 1), 6500);
}

dots.forEach((dot) => {
  dot.addEventListener("click", () => {
    showSlide(Number(dot.dataset.slide || 0));
    startHeroRotation();
  });
});

startHeroRotation();

function activateCapability(panelName, focusTab = false) {
  tabs.forEach((tab) => {
    const isActive = tab.dataset.panel === panelName;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
    tab.tabIndex = isActive ? 0 : -1;
    if (isActive && focusTab) tab.focus();
  });

  panels.forEach((panel) => {
    const isActive = panel.dataset.panel === panelName;
    panel.classList.toggle("is-active", isActive);
    panel.hidden = !isActive;
  });
}

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => activateCapability(tab.dataset.panel));
  tab.addEventListener("mouseenter", () => activateCapability(tab.dataset.panel));
  tab.addEventListener("focus", () => activateCapability(tab.dataset.panel));
  tab.addEventListener("keydown", (event) => {
    const keyMap = {
      ArrowDown: index + 1,
      ArrowRight: index + 1,
      ArrowUp: index - 1,
      ArrowLeft: index - 1,
      Home: 0,
      End: tabs.length - 1
    };

    if (!(event.key in keyMap)) return;
    event.preventDefault();
    const nextIndex = (keyMap[event.key] + tabs.length) % tabs.length;
    activateCapability(tabs[nextIndex].dataset.panel, true);
  });
});

const revealItems = Array.from(document.querySelectorAll(".reveal"));

if ("IntersectionObserver" in window && !reducedMotion) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

if (inquiryForm) {
  inquiryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(inquiryForm);
    const name = formData.get("name") || "";
    const email = formData.get("email") || "";
    const eventType = formData.get("eventType") || "";
    const date = formData.get("date") || "";
    const message = formData.get("message") || "";
    const subject = `HMR Designs inquiry from ${name}`;
    const body = [
      "Hello HMR Designs,",
      "",
      "I am interested in collaborating on an event.",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      `Event type: ${eventType}`,
      `Event date: ${date}`,
      "",
      "Event vision:",
      `${message}`,
      "",
      "Thank you."
    ].join("\n");

    window.location.href = `mailto:concierge@hmrdesigns.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}
