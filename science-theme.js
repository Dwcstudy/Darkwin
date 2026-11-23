"use strict";

const pageBackground = document.getElementById("page-background");
const themeButtons = [...document.querySelectorAll("[data-theme-option]")];
const themeColorMeta = document.querySelector('meta[name="theme-color"]');

function playPageBackground() {
  if (!(pageBackground instanceof HTMLVideoElement)) return;
  pageBackground.muted = true;
  if (pageBackground.paused) {
    pageBackground.play().catch((error) => {
      if (error.name !== "NotAllowedError") {
        console.error("Background video playback failed:", error);
      }
    });
  }
}

function setTheme(theme) {
  const isLight = theme === "light";
  document.body.classList.toggle("light-theme", isLight);
  themeButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.themeOption === theme));
  });
  if (themeColorMeta) themeColorMeta.content = isLight ? "#f5f3ed" : "#070707";

  if (!(pageBackground instanceof HTMLVideoElement)) {
    console.error("Background video element is missing.");
    return;
  }

  const source = isLight ? "darkwinlightbg.mp4" : "darkwinbg.mp4";
  if (pageBackground.getAttribute("src") !== source) {
    pageBackground.pause();
    pageBackground.setAttribute("src", source);
    pageBackground.load();
  }
  playPageBackground();
}

if (!(pageBackground instanceof HTMLVideoElement)) {
  console.error("Background video element is missing.");
} else {
  pageBackground.addEventListener("error", () => {
    console.error("Background video failed to load:", pageBackground.error);
  });
}

themeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const theme = button.dataset.themeOption;
    if (theme === "light" || theme === "dark") setTheme(theme);
  });
});

setTheme(themeButtons.find((button) => button.getAttribute("aria-pressed") === "true")?.dataset.themeOption === "light" ? "light" : "dark");
document.addEventListener("touchstart", playPageBackground, { once: true, passive: true });
document.addEventListener("click", playPageBackground, { once: true });
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) playPageBackground();
});
