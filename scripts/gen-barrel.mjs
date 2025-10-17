import { readdirSync, statSync, writeFileSync } from "fs";
import { join } from "path";

const SRC = "src";
const OUTPUT = join(SRC, "index.ts");

/**
 * Recursively scan src folder for .ts/.tsx files
 */
function scanDir(dir) {
  const entries = readdirSync(dir);
  return entries.flatMap((entry) => {
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      // ❌ skip url/ directory
      if (entry === "url") return [];
      return scanDir(fullPath);
    }

    // include only .ts/.tsx
    if (!/\.(ts|tsx)$/.test(entry)) return [];
    if (/\.test\.(ts|tsx)$/.test(entry)) return [];
    if (entry === "index.ts" || entry === "index.tsx") return [];

    return [fullPath];
  });
}

/**
 * Generate index.ts exports
 */
const FILES = scanDir(SRC);
const content =
  FILES.map((f) => {
    const rel = "./" + f.replace(`${SRC}/`, "").replace(/\.(ts|tsx)$/, "");
    return `export * from "${rel}";`;
  }).join("\n") + "\n";

writeFileSync(OUTPUT, content);
// eslint-disable-next-line no-undef
console.info(`✅ Generated ${OUTPUT} with ${FILES.length} exports`);
