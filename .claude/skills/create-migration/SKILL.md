---
name: create-migration
description: Creates DB migration files for things like creating tables, adding or changing columns, and adding indexes.
---

Create a migration based on the user's instructions.

## Command

```bash
pnpm db:create <name>
```

Example: `pnpm db:create create-users-table`

## Other Commands

- `pnpm db:up` - Run one pending migration
- `pnpm db:latest` - Run all pending migrations
- `pnpm db:down` - Roll back the latest migration

## Rules

- Don't create migration files by hand
- Migration file names: use kebab-case
- Database identifiers: use snake_case
