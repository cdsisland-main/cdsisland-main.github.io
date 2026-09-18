document.querySelectorAll("[data-last-updated]").forEach((element) => {
  const modified = new Date(document.lastModified);
  const date = Number.isNaN(modified.getTime()) ? new Date() : modified;

  element.dateTime = date.toISOString();
  element.textContent = date.toLocaleDateString();
  element.title = `page last changed: ${date.toLocaleString()}`;
});

document.querySelectorAll("[data-go-back]").forEach((element) => {
  if (window.history.length <= 1) return;

  element.hidden = false;
  element.querySelector("button")?.addEventListener("click", () => window.history.back());
});

document.querySelectorAll(".nav a").forEach((link) => {
  const linkPath = new URL(link.href, window.location.href).pathname.replace(/\/$/, "");
  const pagePath = window.location.pathname.replace(/\/$/, "");

  if (linkPath === pagePath) link.setAttribute("aria-current", "page");
});

document.querySelectorAll("[data-sortable-list]").forEach((list) => {
  const items = Array.from(list.querySelectorAll("[data-sortable-item]"));
  const sortControls = list.parentElement.querySelector(".sort-controls");
  const control = sortControls?.querySelector("[data-sort]");

  control?.addEventListener("change", () => {
    const sortBy = control.value;
    const sortedItems = sortBy ? [...items].sort((first, second) => {
      if (sortBy === "title") return first.dataset.title.localeCompare(second.dataset.title);
      if (sortBy === "newest") return new Date(second.dataset.date) - new Date(first.dataset.date);

      return new Date(first.dataset.date) - new Date(second.dataset.date);
    }) : items;

    sortedItems.forEach((item) => list.append(item));
  });

  if (control) sortControls?.removeAttribute("hidden");
});

const gameFrames = {
  lux: { title: "lux and the lightshard", src: "underconstruction.html" },
  longface: { title: "longface.EXE :scared:", src: "underconstruction.html" },
  "party-crashers": { title: "party crashers", src: "underconstruction.html" },
  "project-saturn": { title: "Sonic Project Saturn", src: "../webproto/prototype.html" },
};

const gameKey = new URLSearchParams(window.location.search).get("game");
const game = gameFrames[gameKey];

if (game) {
  document.title = `${game.title} | gameplay`;
  document.querySelectorAll("[data-game-title]").forEach((element) => {
    element.textContent = game.title;
  });
  document.querySelectorAll("[data-game-frame]").forEach((frame) => {
    frame.src = game.src;
    frame.title = `${game.title} game window`;
  });
  document.querySelectorAll("[data-game-fallback]").forEach((link) => {
    link.href = game.src;
  });
}

document.querySelectorAll("[data-game-fullscreen]").forEach((button) => {
  const frame = document.querySelector("[data-game-frame]");

  if (!frame || !document.fullscreenEnabled || !frame.requestFullscreen) return;

  const updateFullscreenButton = () => {
    const isFullscreen = document.fullscreenElement === frame;
    button.textContent = isFullscreen ? "exit fullscreen" : "fullscreen";
    button.setAttribute("aria-pressed", String(isFullscreen));
  };

  button.hidden = false;
  button.addEventListener("click", async () => {
    try {
      if (document.fullscreenElement === frame) {
        await document.exitFullscreen();
      } else {
        await frame.requestFullscreen();
      }
    } catch {
      // The button stays usable if the browser temporarily denies fullscreen.
    }
  });
  document.addEventListener("fullscreenchange", updateFullscreenButton);
  updateFullscreenButton();
});

