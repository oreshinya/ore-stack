import type { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("samples")
    .addColumn("id", "text", (col) => col.notNull().primaryKey())
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("active", "integer", (col) => col.notNull())
    .addColumn("created_at", "text", (col) => col.notNull())
    .addColumn("updated_at", "text", (col) => col.notNull())
    .execute();
  await db.schema
    .createIndex("samples_active")
    .on("samples")
    .column("active")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("samples").execute();
}
