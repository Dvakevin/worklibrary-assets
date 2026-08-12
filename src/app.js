const state = {
  icons: [],
  category: "全部",
  query: "",
};

const elements = {
  categoryList: document.querySelector("#categoryList"),
  iconGrid: document.querySelector("#iconGrid"),
  searchInput: document.querySelector("#searchInput"),
  emptyState: document.querySelector("#emptyState"),
  resultSummary: document.querySelector("#resultSummary"),
  toast: document.querySelector("#toast"),
  toastText: document.querySelector("#toastText"),
};

let toastTimer;

init();

async function init() {
  try {
    const response = await fetch("./icons.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`icons.json: ${response.status}`);

    state.icons = await response.json();
    renderCategories();
    renderIcons();
    bindEvents();
  } catch (error) {
    console.error(error);
    elements.resultSummary.textContent = "图标清单加载失败";
    elements.emptyState.hidden = false;
    elements.emptyState.querySelector("h2").textContent = "读取失败";
    elements.emptyState.querySelector("p").textContent =
      "请确认 Cloudflare Pages 已执行构建脚本并生成 icons.json。";
  }
}

function bindEvents() {
  elements.searchInput.addEventListener("input", (event) => {
    state.query = event.target.value.trim().toLowerCase();
    renderIcons();
  });

  document.addEventListener("keydown", (event) => {
    const isTyping =
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement;

    if (event.key === "/" && !isTyping) {
      event.preventDefault();
      elements.searchInput.focus();
    }

    if (event.key === "Escape" && document.activeElement === elements.searchInput) {
      elements.searchInput.value = "";
      state.query = "";
      elements.searchInput.blur();
      renderIcons();
    }
  });
}

function renderCategories() {
  const counts = state.icons.reduce((map, icon) => {
    map.set(icon.category, (map.get(icon.category) || 0) + 1);
    return map;
  }, new Map());

  const categories = [
    { name: "全部", count: state.icons.length },
    ...[...counts.entries()]
      .sort(([a], [b]) => a.localeCompare(b, "zh-CN"))
      .map(([name, count]) => ({ name, count })),
  ];

  elements.categoryList.innerHTML = categories
    .map(
      ({ name, count }) => `
        <button
          class="category-button ${state.category === name ? "is-active" : ""}"
          type="button"
          data-category="${escapeHTML(name)}"
        >
          <span>${escapeHTML(formatCategory(name))}</span>
          <span class="category-count">${count}</span>
        </button>
      `
    )
    .join("");

  elements.categoryList
    .querySelectorAll(".category-button")
    .forEach((button) => {
      button.addEventListener("click", () => {
        state.category = button.dataset.category;
        renderCategories();
        renderIcons();
      });
    });
}

function renderIcons() {
  const filtered = state.icons.filter((icon) => {
    const matchesCategory =
      state.category === "全部" || icon.category === state.category;

    const haystack = [
      icon.name,
      icon.displayName,
      icon.category,
      icon.path,
    ]
      .join(" ")
      .toLowerCase();

    return matchesCategory && haystack.includes(state.query);
  });

  elements.resultSummary.textContent =
    state.category === "全部"
      ? `${filtered.length} 个图标`
      : `${formatCategory(state.category)} · ${filtered.length} 个图标`;

  elements.emptyState.hidden = filtered.length !== 0;
  elements.iconGrid.hidden = filtered.length === 0;

  elements.iconGrid.innerHTML = filtered
    .map((icon, index) => {
      const assetURL = toAbsoluteURL(icon.url);
      return `
        <article
          class="icon-card"
          tabindex="0"
          role="button"
          aria-label="复制 ${escapeHTML(icon.displayName)} 的 CSS"
          data-url="${escapeHTML(assetURL)}"
          style="--i:${Math.min(index, 24)}"
        >
          <a
            class="download-button"
            href="${escapeHTML(icon.url)}"
            download="${escapeHTML(icon.filename)}"
            title="下载 SVG"
            aria-label="下载 ${escapeHTML(icon.displayName)} SVG"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 3v12m0 0 4.5-4.5M12 15l-4.5-4.5M5 20h14" />
            </svg>
          </a>

          <div class="icon-preview">
            <img src="${escapeHTML(icon.url)}" alt="" loading="lazy" />
          </div>

          <div class="icon-name" title="${escapeHTML(icon.displayName)}">
            ${escapeHTML(icon.displayName)}
          </div>

          <div class="copy-hint">点击复制 CSS</div>
        </article>
      `;
    })
    .join("");

  elements.iconGrid.querySelectorAll(".icon-card").forEach((card) => {
    card.addEventListener("click", async (event) => {
      if (event.target.closest(".download-button")) return;
      await copyIconCSS(card);
    });

    card.addEventListener("keydown", async (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        await copyIconCSS(card);
      }
    });
  });
}

async function copyIconCSS(card) {
  const url = card.dataset.url;
  const css = `background-image: url("${url}");`;

  try {
    await navigator.clipboard.writeText(css);
  } catch {
    fallbackCopy(css);
  }

  card.classList.remove("is-copied");
  requestAnimationFrame(() => card.classList.add("is-copied"));
  setTimeout(() => card.classList.remove("is-copied"), 620);

  showToast(`已复制：${css}`);
}

function showToast(text) {
  clearTimeout(toastTimer);
  elements.toastText.textContent = text;
  elements.toast.classList.add("is-visible");

  toastTimer = setTimeout(() => {
    elements.toast.classList.remove("is-visible");
  }, 1800);
}

function fallbackCopy(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

function toAbsoluteURL(path) {
  return new URL(path, window.location.origin).href;
}

function formatCategory(category) {
  if (category === "全部" || category === "未分类") return category;
  return category
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function escapeHTML(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
