import { readdir, rm, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const productRoot = path.resolve("public/assets/products");
const sizes = [480, 900, 1400];
const removeOriginals = process.argv.includes("--remove-originals");

const isSourcePng = (fileName) => /^\d+-.+\.png$/i.test(fileName);

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
    } else if (entry.isFile() && isSourcePng(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

const sourceFiles = await walk(productRoot);
let originalBytes = 0;
let optimizedBytes = 0;

for (const sourceFile of sourceFiles) {
  const sourceInfo = await stat(sourceFile);
  originalBytes += sourceInfo.size;

  const parsed = path.parse(sourceFile);
  const metadata = await sharp(sourceFile).rotate().metadata();

  for (const width of sizes) {
    const outputPath = path.join(parsed.dir, `${parsed.name}-${width}.webp`);
    const targetWidth = metadata.width && metadata.width < width ? metadata.width : width;

    await sharp(sourceFile)
      .rotate()
      .resize({ width: targetWidth, withoutEnlargement: true })
      .webp({ quality: 78, effort: 5 })
      .toFile(outputPath);

    const outputInfo = await stat(outputPath);
    optimizedBytes += outputInfo.size;
  }

  if (removeOriginals) {
    await rm(sourceFile);
  }
}

const mb = (bytes) => `${(bytes / 1024 / 1024).toFixed(2)} MB`;

console.log(`Optimized ${sourceFiles.length} product images.`);
console.log(`Original PNG total: ${mb(originalBytes)}`);
console.log(`Generated WebP total: ${mb(optimizedBytes)} across ${sizes.length} sizes.`);
console.log(`Original PNG files ${removeOriginals ? "removed" : "kept"}.`);
