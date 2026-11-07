import { promises as fs } from "node:fs";
import path from "node:path";

const root = process.cwd();
const output = path.join(root, "dist");
const staticFiles = [
  "index.html",
  "styles.css",
  "app.js",
  "home-preview.png",
];

await fs.rm(output, { recursive: true, force: true });
await fs.mkdir(output, { recursive: true });

for (const filename of staticFiles) {
  await fs.copyFile(path.join(root, filename), path.join(output, filename));
}

console.log(`Built ${staticFiles.length} static files into dist/`);
