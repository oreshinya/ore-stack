import * as fs from "node:fs/promises";
import path from "node:path";
import { FileMigrationProvider, Migrator } from "kysely/migration";
import { vi } from "vitest";

vi.mock("~mq/client", () => ({
  enqueue: vi.fn(),
}));

const dbPath = `libsql/test-${process.env["VITEST_POOL_ID"] || "0"}.db`;
process.env["DB_URL"] = `file:${dbPath}`;
await fs.rm(dbPath, { force: true });

const { db } = await import("~/adapters/db/client");

const migrationFolder = new URL("../migrations", import.meta.url).pathname;

const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider({
    fs,
    path,
    migrationFolder,
  }),
  allowUnorderedMigrations: true,
});

const { error } = await migrator.migrateToLatest();

if (error) {
  throw error;
}
