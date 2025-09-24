import * as fs from "node:fs/promises";
import path from "node:path";
import { FileMigrationProvider, Migrator } from "kysely";
import { run } from "kysely-migration-cli";
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

run(db, migrator, migrationFolder);
