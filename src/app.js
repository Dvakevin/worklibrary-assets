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

/* =========================
   初始化
========================= */

async function init() {
  try {
    const response = await fetch("./icons.json", {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`icons.json 加载失败：${response.status}`);
    }

    state.icons = await response.json();

    renderCategories();
    renderIcons();
    bindEvents();
  } catch (error) {
    console.error(error);

    elements.resultSummary.textContent = "图标清单加载失败";

    elements.emptyState.hidden = false;

    elements.emptyState.querySelector("h2").textContent =
      "读取失败";

    elements.emptyState.querySelector("p").textContent =
      "请确认 icons.json 已正常生成。";
  }
}

/* =========================
   绑定交互
========================= */

function bindEvents() {
  // 搜索
  elements.searchInput.addEventListener("input", (event) => {
    state.query = event.target.value
      .trim()
      .toLowerCase();

    renderIcons();
  });

  // 快捷键
  document.addEventListener("keydown", (event) => {
    const isTyping =
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement;

    // 按 / 聚焦搜索框
    if (event.key === "/" && !isTyping) {
      event.preventDefault();

      elements.searchInput.focus();
    }

    // ESC 清空搜索
    if (
      event.key === "Escape" &&
      document.activeElement === elements.searchInput
    ) {
      elements.searchInput.value = "";

      state.query = "";

      elements.searchInput.blur();

      renderIcons();
    }
  });
}

/* =========================
   分类
========================= */

function renderCategories() {
  const counts = state.icons.reduce(
    (map, icon) => {
      map.set(
        icon.category,
        (map.get(icon.category) || 0) + 1
      );

      return map;
    },
    new Map()
  );

  const categories = [
    {
      name: "全部",
      count: state.icons.length,
    },

    ...[...counts.entries()]
      .sort(([a], [b]) =>
        a.localeCompare(b, "zh-CN")
      )
      .map(([name, count]) => ({
        name,
        count,
      })),
  ];

  elements.categoryList.innerHTML = categories
    .map(
      ({ name, count }) => `
        <button
          class="category-button ${
            state.category === name
              ? "is-active"
              : ""
          }"
          type="button"
          data-category="${escapeHTML(name)}"
        >
          <span>
            ${escapeHTML(formatCategory(name))}
          </span>

          <span class="category-count">
            ${count}
          </span>
        </button>
      `
    )
    .join("");

  elements.categoryList
    .querySelectorAll(".category-button")
    .forEach((button) => {
      button.addEventListener("click", () => {
        state.category =
          button.dataset.category;

        renderCategories();
        renderIcons();
      });
    });
}

/* =========================
   图标列表
========================= */

function renderIcons() {
  const filtered = state.icons.filter(
    (icon) => {
      const matchesCategory =
        state.category === "全部" ||
        icon.category === state.category;

      const searchContent = [
        icon.name,
        icon.displayName,
        icon.category,
        icon.path,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        searchContent.includes(state.query);

      return (
        matchesCategory &&
        matchesSearch
      );
    }
  );

  /* 数量 */

  if (state.category === "全部") {
    elements.resultSummary.textContent =
      `${filtered.length} 个图标`;
  } else {
    elements.resultSummary.textContent =
      `${formatCategory(
        state.category
      )} · ${filtered.length} 个图标`;
  }

  /* 空状态 */

  elements.emptyState.hidden =
    filtered.length !== 0;

  elements.iconGrid.hidden =
    filtered.length === 0;

  /* 渲染 */

  elements.iconGrid.innerHTML = filtered
    .map((icon, index) => {
      const assetURL =
        toAbsoluteURL(icon.url);

      return `
        <article
          class="icon-card"
          tabindex="0"
          role="button"
          aria-label="复制 ${escapeHTML(
            icon.displayName
          )} 链接"
          data-url="${escapeHTML(assetURL)}"
          style="--i:${Math.min(index, 24)}"
        >

          <!-- 下载 SVG -->
          <a
            class="download-button"
            href="${escapeHTML(icon.url)}"
            download="${escapeHTML(
              icon.filename
            )}"
            title="下载 SVG"
            aria-label="下载 ${escapeHTML(
              icon.displayName
            )} SVG"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="
                  M12 3v12
                  m0 0 4.5-4.5
                  M12 15l-4.5-4.5
                  M5 20h14
                "
              />
            </svg>
          </a>

          <!-- 图标 -->
          <div class="icon-preview">
            <img
              src="${escapeHTML(icon.url)}"
              alt=""
              loading="lazy"
            />
          </div>

          <!-- 名称 -->
          <div
            class="icon-name"
            title="${escapeHTML(
              icon.displayName
            )}"
          >
            ${escapeHTML(icon.displayName)}
          </div>

          <!-- Hover 提示 -->
          <div class="copy-hint">
            点击复制链接
          </div>

        </article>
      `;
    })
    .join("");

  /* 卡片点击 */

  elements.iconGrid
    .querySelectorAll(".icon-card")
    .forEach((card) => {

      card.addEventListener(
        "click",
        async (event) => {

          // 点击下载按钮时
          // 不执行复制
          if (
            event.target.closest(
              ".download-button"
            )
          ) {
            return;
          }

          await copyIconURL(card);
        }
      );

      /* 键盘 Enter / Space */

      card.addEventListener(
        "keydown",
        async (event) => {

          if (
            event.key === "Enter" ||
            event.key === " "
          ) {
            event.preventDefault();

            await copyIconURL(card);
          }
        }
      );
    });
}

/* =========================
   点击复制 URL
========================= */

async function copyIconURL(card) {
  const url = card.dataset.url;

  try {
    await navigator.clipboard.writeText(
      url
    );
  } catch (error) {
    fallbackCopy(url);
  }

  /* 卡片复制动画 */

  card.classList.remove("is-copied");

  requestAnimationFrame(() => {
    card.classList.add("is-copied");
  });

  setTimeout(() => {
    card.classList.remove("is-copied");
  }, 620);

  /* Toast */

  showToast(
    `已复制链接：${url}`
  );
}

/* =========================
   Toast
========================= */

function showToast(text) {
  clearTimeout(toastTimer);

  elements.toastText.textContent = text;

  elements.toast.classList.add(
    "is-visible"
  );

  toastTimer = setTimeout(() => {
    elements.toast.classList.remove(
      "is-visible"
    );
  }, 1800);
}

/* =========================
   Clipboard fallback
========================= */

function fallbackCopy(text) {
  const textarea =
    document.createElement("textarea");

  textarea.value = text;

  textarea.setAttribute(
    "readonly",
    ""
  );

  textarea.style.position = "fixed";
  textarea.style.opacity = "0";

  document.body.appendChild(textarea);

  textarea.select();

  document.execCommand("copy");

  textarea.remove();
}

/* =========================
   URL
========================= */

function toAbsoluteURL(path) {
  return new URL(
    path,
    window.location.origin
  ).href;
}

/* =========================
   分类名称格式化
========================= */

function formatCategory(category) {
  if (
    category === "全部" ||
    category === "未分类"
  ) {
    return category;
  }

  return category
    .replace(/[-_]+/g, " ")
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase()
    );
}

/* =========================
   防止 HTML 注入
========================= */

function escapeHTML(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}