import * as fs from "node:fs";
import * as path from "node:path";
import * as readline from "node:readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query: string): Promise<string> => {
  return new Promise((resolve) => rl.question(query, resolve));
};

const filesToRemove = [
  "app/adapters/db/tables/sample.ts",
  "app/models/sample",
  "app/routes/samples",
  "migrations/20250927T062238-create-sample.ts",
  "LICENSE",
];

const filesToUpdate: Array<{
  path: string;
  search: string | RegExp;
  replace: string | ((substring: string, ...args: Array<string>) => string);
}> = [
  {
    path: "app/adapters/db/database.ts",
    search: /^.*$/s,
    replace: "export interface Database {}\n",
  },
];

const picoCssUpdates: Array<{
  path: string;
  search: string | RegExp;
  replace: string | ((substring: string, ...args: Array<string>) => string);
}> = [
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

const main = async () => {
  console.log("Removing sample code...\n");

  // Ask about Pico CSS removal
  const removePicoCss = await question(
    "Do you want to remove Pico CSS? (y/N): ",
  );
  rl.close();

  const shouldRemovePicoCss =
    removePicoCss.toLowerCase() === "y" ||
    removePicoCss.toLowerCase() === "yes";

  if (shouldRemovePicoCss) {
    filesToUpdate.push(...picoCssUpdates);
    console.log("✓ Pico CSS will be removed\n");
  } else {
    console.log("✓ Pico CSS will be kept\n");
  }

  // Remove files and directories
  for (const file of filesToRemove) {
    const fullPath = path.join(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      const stats = fs.statSync(fullPath);
      if (stats.isDirectory()) {
        fs.rmSync(fullPath, { recursive: true, force: true });
        console.log(`✓ Removed directory: ${file}`);
      } else {
        fs.unlinkSync(fullPath);
        console.log(`✓ Removed file: ${file}`);
      }
    } else {
      console.log(`⚠ Not found: ${file}`);
    }
  }

  console.log();

  // Update files
  for (const update of filesToUpdate) {
    const fullPath = path.join(process.cwd(), update.path);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, "utf-8");
      const newContent =
        typeof update.replace === "string"
          ? content.replace(update.search, update.replace)
          : content.replace(update.search, update.replace);

      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent, "utf-8");
        console.log(`✓ Updated: ${update.path}`);
      } else {
        console.log(`⚠ No changes needed: ${update.path}`);
      }
    } else {
      console.log(`⚠ Not found: ${update.path}`);
    }
  }

  console.log("\n✓ Sample code removal completed");

  // Remove this script itself
  const scriptPath = path.join(process.cwd(), "tasks/remove-samples.ts");
  if (fs.existsSync(scriptPath)) {
    fs.unlinkSync(scriptPath);
    console.log("✓ Removed this script itself");
  }

  if (shouldRemovePicoCss) {
    console.log("\nNext step:");
    console.log("  Run: pnpm install (to remove @picocss/pico)");
  }
};

main().catch(console.error);
