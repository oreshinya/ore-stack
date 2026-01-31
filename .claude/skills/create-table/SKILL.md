---
name: create-table
description: Create a new database table definition
---

# Create Table

Create a new database table definition.

## Usage

```
/create-table <entity-name>
```

Example: `/create-table user`

## Steps

1. Run template generator:
   ```bash
   pnpm sscg table -r <entity-name> -o app/adapters/db/tables
   ```

2. Register the table in `app/adapters/db/database.ts`:
   - Import the table type
   - Add to Database interface

3. Create migration file:
   ```bash
   pnpm tsx tasks/db.ts create create-<entity-name-plural>-table
   ```

4. Implement the migration (snake_case for DB identifiers)

## File Structure

```
app/adapters/db/tables/<entity-name>.ts
```

## Table Definition Pattern

```typescript
import type { ExpressionBuilder } from "kysely";
import * as v from "valibot";
import type { TableBase } from "./table-base";

export interface EntityTable extends TableBase<EntityId> {
  name: string;
  active: boolean;
}

export type EntityId = v.InferOutput<typeof EntityIdSchema>;

export const EntityIdSchema = v.pipe(v.string(), v.brand("EntityId"));

export type EntityEb = ExpressionBuilder<{ entities: EntityTable }, "entities">;

export const scope = {
  active: () => (eb: EntityEb) => eb("entities.active", "=", true),
};
```

## Optional: Relation Helper

For loading nested data:

```typescript
import { type Expression, expressionBuilder } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/sqlite";

export function withEntity(entityId: Expression<EntityId>) {
  const eb: EntityEb = expressionBuilder();
  return jsonObjectFrom(
    eb
      .selectFrom("entities")
      .select(["entities.id", "entities.name", "entities.createdAt", "entities.updatedAt"])
      .whereRef("entities.id", "=", entityId),
  ).$notNull();
}
```

## Rules

- File names: kebab-case
- Table names in DB: snake_case (plural)
- Column names in DB: snake_case
- Always extend `TableBase<Id>` for id, createdAt, updatedAt
