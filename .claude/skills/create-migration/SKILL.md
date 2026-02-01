---
name: create-migration
description: Create a new database migration
user-invocable: false
---

Create a migration for $ARGUMENTS.

## Command

```bash
pnpm tsx tasks/db.ts create <name>
```

Example: `pnpm tsx tasks/db.ts create create-users-table`

## Other Commands

- `pnpm tsx tasks/db.ts up` - Run a pending migration
- `pnpm tsx tasks/db.ts latest` - Run all pending migrations
- `pnpm tsx tasks/db.ts down` - Revert the latest migration

## Rules

- Never create migration files manually
- Migration file names: use kebab-case
- Database identifiers: use snake_case
