# Worklibrary Icon Library

一个给设计/前端团队使用的静态 Icon Library。

## 图标怎么放

推荐用文件夹做分类：

```text
icons/
├── action/
│   ├── add.svg
│   └── delete.svg
├── navigation/
│   ├── arrow-left.svg
│   └── close.svg
└── status/
    ├── success.svg
    └── warning.svg
```

如果 SVG 直接放在 `icons/` 根目录，会自动归入“未分类”。

## 自动更新逻辑

每次你把新的 SVG push 到 GitHub：

1. Cloudflare Pages 触发构建
2. `scripts/build.mjs` 扫描 `icons/`
3. 自动生成 `icons.json`
4. 自动把网页和全部 SVG 输出到 `dist/`
5. Pages 发布 `dist/`
6. 新图标自动出现在网站，不需要手改 HTML

## Cloudflare Pages 配置

- Production branch: `main`
- Framework preset: `None`
- Build command: `npm run build`
- Build output directory: `dist`

## 本地预览

需要 Node.js 18+：

```bash
npm run build
npx serve dist
```

然后打开终端提示的本地网址。

## 使用方式

点击图标卡片会复制：

```css
background-image: url("https://你的域名/icons/action/search.svg");
```

卡片右上角下载按钮会直接下载 SVG。


## 注意：不要直接双击 `src/index.html`

`src/` 是源码目录，图标列表需要读取构建生成的 `icons.json`。
要本地预览，请先：

```bash
npm run build
python3 preview.py
```

然后打开：

```text
http://localhost:8080
```

部署到 Cloudflare Pages 时仍然使用：

- Build command: `npm run build`
- Build output directory: `dist`
