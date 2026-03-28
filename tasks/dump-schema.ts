import { writeFile } from "node:fs/promises";
import { sql } from "kysely";
import { db } from "~/adapters/db/client";

const result = await sql<{ sql: string }>`
  SELECT sql FROM sqlite_master
  WHERE sql IS NOT NULL
  AND name NOT LIKE 'sqlite_%'
  AND name NOT LIKE 'kysely_%'
  ORDER BY
    CASE type
      WHEN 'table' THEN 1
      WHEN 'index' THEN 2
      ELSE 3
    END,
    name
`.execute(db);

const schema = result.rows.map((row) => `${row.sql};`).join("\n\n");
await writeFile("schema.sql", `${schema}\n`);

await db.destroy();
