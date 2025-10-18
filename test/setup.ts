import * as fs from "node:fs/promises";
import path from "node:path";
import { FileMigrationProvider, Migrator } from "kysely";
import { db } from "~/adapters/db/client";

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

await migrator.migrateToLatest();
