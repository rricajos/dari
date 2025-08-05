// /js/controllers/ThemeController.js

import { saveTheme, loadTheme } from "../../storage.js";

const ThemeController = {
  toggleEl: null,

  init() {
    this.toggleEl = document.getElementById("themeToggle");
    if (!this.toggleEl) return;

    this.toggleEl.onchange = () => {
      const mode = this.toggleEl.checked ? "dark" : "light";
      saveTheme(mode);
      this.apply();
    };

    this.apply();
  },

  apply() {
    const pref = loadTheme();
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (pref === "dark" || (!pref && prefersDark)) {
      document.documentElement.classList.add("dark");
      this.toggleEl.checked = true;
    } else {
      document.documentElement.classList.remove("dark");
      this.toggleEl.checked = false;
    }
  },
};

export default ThemeController;
