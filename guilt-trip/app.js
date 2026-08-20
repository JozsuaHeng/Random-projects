const MESSAGES = [
  "Message queued.",
  "Recipient has been notified.",
  "This feature is not yet available for public download.",
];

const toast = document.getElementById("toast");
let messageIndex = 0;
let hideTimer = null;

function showToast() {
  const message = MESSAGES[messageIndex % MESSAGES.length];
  messageIndex++;

  toast.textContent = message;
  toast.classList.add("visible");

  clearTimeout(hideTimer);
  hideTimer = setTimeout(() => {
    toast.classList.remove("visible");
  }, 2600);
}

document.querySelectorAll("[data-download]").forEach((button) => {
  button.addEventListener("click", showToast);
});

// Pricing monthly/yearly toggle: just flips a class on #pricingGrid —
// the monthly/yearly price variants are both already in the markup,
// CSS handles which one is visible (see .price-period-monthly/-yearly
// in style.css).
const priceToggleButtons = document.querySelectorAll(".price-toggle-btn");
const pricingGrid = document.getElementById("pricingGrid");

if (pricingGrid && priceToggleButtons.length) {
  priceToggleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      pricingGrid.classList.toggle("yearly", button.dataset.period === "yearly");
      priceToggleButtons.forEach((b) => b.classList.toggle("active", b === button));
    });
  });
}

// Phone screenshot carousel: advances through the screens on its own,
// but a visitor can also drag/swipe it or tap a dot to jump directly.
// Any manual interaction pauses autoplay for a bit, then it resumes
// from wherever they left it.
const viewport = document.getElementById("phoneViewport");
const dots = Array.from(document.querySelectorAll("#phoneDots .dot"));

if (viewport) {
  const AUTOPLAY_MS = 3500;
  const RESUME_AFTER_MS = 4000;
  const screenCount = viewport.children.length;

  let currentIndex = 0;
  let autoplayTimer = null;
  let resumeTimer = null;
  let paused = false;

  const setActiveDot = (index) => {
    dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
  };

  const goTo = (index) => {
    currentIndex = ((index % screenCount) + screenCount) % screenCount;
    viewport.scrollTo({ left: currentIndex * viewport.clientWidth, behavior: "smooth" });
    setActiveDot(currentIndex);
  };

  autoplayTimer = setInterval(() => {
    if (!paused) goTo(currentIndex + 1);
  }, AUTOPLAY_MS);

  const pauseForInteraction = () => {
    paused = true;
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(() => { paused = false; }, RESUME_AFTER_MS);
  };
  viewport.addEventListener("pointerdown", pauseForInteraction);
  viewport.addEventListener("wheel", pauseForInteraction, { passive: true });

  let scrollTimer = null;
  viewport.addEventListener("scroll", () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      currentIndex = Math.round(viewport.scrollLeft / viewport.clientWidth);
      setActiveDot(currentIndex);
    }, 100);
  });

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      pauseForInteraction();
      goTo(Number(dot.dataset.index));
    });
  });
}
