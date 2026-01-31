---
name: migrate
description: Manage database migrations
---

# Migrate

Manage database migrations.

## Usage

```
/migrate <command> [name]
```

Commands:
- `/migrate create <name>` - Create a new migration file
- `/migrate up` - Run a single pending migration
- `/migrate latest` - Run all pending migrations
- `/migrate down` - Revert the latest migration

## Examples

```bash
# Create migration for new table
/migrate create create-users-table

# Create migration for adding column
/migrate create add-email-to-users

# Run pending migrations
/migrate latest

# Revert last migration
/migrate down
```

## Commands

### Create Migration

```bash
pnpm tsx tasks/db.ts create <name>
```

Creates a new migration file in the migrations directory.

### Run Migrations

```bash
# Run one pending migration
pnpm tsx tasks/db.ts up

# Run all pending migrations
pnpm tsx tasks/db.ts latest

# Revert last migration
pnpm tsx tasks/db.ts down
```

## Migration File Pattern

```typescript
import type { Kysely } from "kysely";

export async function up(db: Kysely<unknown>) {
  await db.schema
    .createTable("users")
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("email", "text", (col) => col.notNull().unique())
    .addColumn("active", "integer", (col) => col.notNull().defaultTo(1))
    .addColumn("created_at", "text", (col) => col.notNull())
    .addColumn("updated_at", "text", (col) => col.notNull())
    .execute();

  await db.schema
    .createIndex("idx_users_email")
    .on("users")
    .column("email")
    .execute();
}

export async function down(db: Kysely<unknown>) {
  await db.schema.dropTable("users").execute();
}
```

## Rules

- Never create migration files manually - always use the create command
- Migration file names: kebab-case
- Database identifiers: snake_case
  - Table names: `users`, `user_profiles`
  - Column names: `created_at`, `user_id`
  - Index names: `idx_users_email`
- Boolean columns: use `integer` with 0/1
- Timestamps: use `text` with ISO 8601 format
- Always implement both `up` and `down` functions
