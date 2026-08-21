(() => {
  const root = document.documentElement;
  const toggle = document.querySelector(".theme-demo-toggle");
  const themeColor = document.querySelector('meta[name="theme-color"]');

  if (!toggle) return;

  const applyTheme = (theme, persist = true) => {
    const nextTheme = theme === "light" ? "light" : "dark";
    root.dataset.theme = nextTheme;
    toggle.dataset.activeTheme = nextTheme;
    toggle.setAttribute("aria-pressed", String(nextTheme === "light"));
    toggle.setAttribute(
      "aria-label",
      nextTheme === "light" ? "Switch to dark theme" : "Switch to light theme",
    );

    if (themeColor) {
      themeColor.setAttribute("content", nextTheme === "light" ? "#ffffff" : "#050506");
    }

    if (persist) {
      try {
        localStorage.setItem("1v1pro-theme", nextTheme);
      } catch {
        // The demo still works when storage is blocked.
      }
    }

    window.dispatchEvent(new CustomEvent("themechange", { detail: { theme: nextTheme } }));
  };

  applyTheme(root.dataset.theme, false);

  toggle.addEventListener("click", () => {
    applyTheme(root.dataset.theme === "light" ? "dark" : "light");
  });
})();
