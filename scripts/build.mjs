import { promises as fs } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const ICONS_DIR = path.join(ROOT, "icons");
const SRC_DIR = path.join(ROOT, "src");
const DIST_DIR = path.join(ROOT, "dist");

await fs.rm(DIST_DIR, { recursive: true, force: true });
await fs.mkdir(DIST_DIR, { recursive: true });

await copyDir(SRC_DIR, DIST_DIR);
await copyDir(ICONS_DIR, path.join(DIST_DIR, "icons"));

const iconFiles = await walk(ICONS_DIR);

const icons = iconFiles
  .filter((file) => file.toLowerCase().endsWith(".svg"))
  .map((file) => {
    const relative = path.relative(ICONS_DIR, file).split(path.sep).join("/");
    const parts = relative.split("/");
    const filename = parts.at(-1);
    const rawName = filename.replace(/\.svg$/i, "");

    // icons/action/delete.svg -> category = action
    // icons/search.svg        -> category = 未分类
    const category = parts.length > 1 ? parts[0] : "未分类";

    return {
      name: rawName.toLowerCase(),
      displayName: prettify(rawName),
      filename,
      category,
      path: relative,
      url: `/icons/${encodeURI(relative)}`,
    };
  })
  .sort((a, b) =>
    `${a.category}/${a.name}`.localeCompare(`${b.category}/${b.name}`, "zh-CN")
  );

await fs.writeFile(
  path.join(DIST_DIR, "icons.json"),
  JSON.stringify(icons, null, 2),
  "utf8"
);

console.log(`Built ${icons.length} icons into dist/`);

async function walk(directory) {
  let results = [];

  try {
    const entries = await fs.readdir(directory, { withFileTypes: true });

    for (const entry of entries) {
      const full = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        results = results.concat(await walk(full));
      } else {
        results.push(full);
      }
    }
  } catch (error) {
    if (error.code === "ENOENT") {
      console.warn(`No icons directory found at ${directory}`);
      return [];
    }
    throw error;
  }

  return results;
}

async function copyDir(from, to) {
  try {
    await fs.cp(from, to, { recursive: true });
  } catch (error) {
    if (error.code === "ENOENT") return;
    throw error;
  }
}

function prettify(name) {
  return name
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
