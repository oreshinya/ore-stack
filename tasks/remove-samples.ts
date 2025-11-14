import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as readline from "node:readline/promises";

interface FileUpdate {
  path: string;
  search: string | RegExp;
  replace: string;
}

function isNodeError(err: unknown): err is NodeJS.ErrnoException {
  return err instanceof Error;
}

const FILES_TO_REMOVE = [
  "app/adapters/db/tables/sample.ts",
  "app/models/sample",
  "app/routes/samples",
  "migrations/20250927T062238-create-sample.ts",
  "LICENSE",
];

const FILES_TO_UPDATE: Array<FileUpdate> = [
  {
    path: "app/adapters/db/database.ts",
    search: /^.*$/s,
    replace: "export interface Database {}\n",
  },
];

const PICO_CSS_UPDATES: Array<FileUpdate> = [
  {
    path: "app/root.tsx",
    search: /^import "@picocss\/pico";\n/m,
    replace: "",
  },
  {
    path: "package.json",
    search: /^\s*"@picocss\/pico":\s*"[^"]+",\n/m,
    replace: "",
  },
];

async function promptUser(query: string) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    return await rl.question(query);
  } finally {
    rl.close();
  }
}

async function removeFiles(files: Array<string>, baseDir: string) {
  for (const file of files) {
    const fullPath = path.join(baseDir, file);
    try {
      const stats = await fs.stat(fullPath);
      if (stats.isDirectory()) {
        await fs.rm(fullPath, { recursive: true, force: true });
        console.log(`✓ Removed directory: ${file}`);
      } else {
        await fs.unlink(fullPath);
        console.log(`✓ Removed file: ${file}`);
      }
    } catch (err) {
      if (!isNodeError(err) || err.code !== "ENOENT") {
        throw err;
      }
    }
  }
}

async function updateFiles(updates: Array<FileUpdate>, baseDir: string) {
  for (const update of updates) {
    const fullPath = path.join(baseDir, update.path);
    try {
      const content = await fs.readFile(fullPath, "utf-8");
      const newContent = content.replace(update.search, update.replace);

      if (content !== newContent) {
        await fs.writeFile(fullPath, newContent, "utf-8");
        console.log(`✓ Updated: ${update.path}`);
      }
    } catch (err) {
      if (!isNodeError(err) || err.code !== "ENOENT") {
        throw err;
      }
    }
  }
}

async function main() {
  const baseDir = process.cwd();

  console.log("Removing sample code...");
  console.log("");

  const answer = (
    await promptUser("Do you want to remove Pico CSS? (y/N): ")
  ).toLowerCase();

  const shouldRemovePicoCss = answer === "y" || answer === "yes";

  const updates = shouldRemovePicoCss
    ? [...FILES_TO_UPDATE, ...PICO_CSS_UPDATES]
    : FILES_TO_UPDATE;

  if (shouldRemovePicoCss) {
    console.log("✓ Pico CSS will be removed");
  } else {
    console.log("✓ Pico CSS will be kept");
  }
  console.log("");

  await removeFiles(FILES_TO_REMOVE, baseDir);

  console.log("");

  await updateFiles(updates, baseDir);

  console.log("");
  console.log("✓ Sample code removal completed");

  const scriptPath = path.join(baseDir, "tasks/remove-samples.ts");
  await fs.unlink(scriptPath);
  console.log("✓ Removed this script itself");

  if (shouldRemovePicoCss) {
    console.log("");
    console.log("Next step:");
    console.log("  Run: pnpm install (to remove @picocss/pico)");
  }
}

main().catch(console.error);
