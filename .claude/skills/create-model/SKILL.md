---
name: create-model
description: Create a new model with entity, query, and command files
---

# Create Model

Create a new model with entity, query, and command files.

## Usage

```
/create-model <entity-name>
```

Example: `/create-model user`

## Steps

1. Ensure table definition exists in `app/adapters/db/tables/<entity-name>.ts`

2. Run template generator:
   ```bash
   pnpm sscg db-model -r <entity-name> -o app/models/<entity-name>
   ```

3. Customize generated files as needed

## File Structure

```
app/models/<entity-name>/
├── entity.ts    # Type definitions and pure functions
├── query.ts     # Read operations
└── command.ts   # Write operations
```

## entity.ts Pattern

```typescript
import type { Selectable } from "kysely";
import type { EntityTable } from "~/adapters/db/tables/entity";
import type { CreateParams } from "~/adapters/db/tables/table-base";
import { failure, success } from "~/data/result";

export type Entity = Selectable<EntityTable>;

export function validateEntity(params: CreateParams<EntityTable>) {
  const { name } = params;
  if (!name) return failure("Name is required.");
  if (name.length > 255) return failure("Name must not exceed 255 characters.");
  return success(params);
}

export function encodeToPublicEntity(entity: Entity) {
  const { id, name, createdAt, updatedAt } = entity;
  return { id, name, createdAt, updatedAt };
}

export type PublicEntity = ReturnType<typeof encodeToPublicEntity>;
```

## query.ts Pattern

```typescript
import type { DBClient } from "~/adapters/db/client";
import type { EntityId } from "~/adapters/db/tables/entity";

export async function findEntityById(c: DBClient, id: EntityId) {
  return await c
    .selectFrom("entities")
    .selectAll("entities")
    .where("id", "=", id)
    .executeTakeFirst();
}

export async function findEntityByIdOrThrow(c: DBClient, id: EntityId) {
  return await c
    .selectFrom("entities")
    .selectAll("entities")
    .where("id", "=", id)
    .executeTakeFirstOrThrow();
}

export async function findAllEntities(c: DBClient) {
  return await c
    .selectFrom("entities")
    .selectAll("entities")
    .orderBy("id", "desc")
    .execute();
}
```

## command.ts Pattern

```typescript
import type { DBClient } from "~/adapters/db/client";
import type { EntityId, EntityTable } from "~/adapters/db/tables/entity";
import type { CreateParams, UpdateParams } from "~/adapters/db/tables/table-base";
import { generateId } from "~/data/id";
import { failure, success } from "~/data/result";
import { type Entity, validateEntity } from "./entity";
import { findEntityByIdOrThrow } from "./query";

export async function createEntity(c: DBClient, params: CreateParams<EntityTable>) {
  const id = generateId<EntityId>();
  const now = new Date().toISOString();
  const record = { id, ...params, createdAt: now, updatedAt: now };
  const result = validateEntity(record);
  if (!result.success) return result;
  await c.insertInto("entities").values(record).executeTakeFirstOrThrow();
  const created = await findEntityByIdOrThrow(c, id);
  return success(created);
}

export async function updateEntity(c: DBClient, params: UpdateParams<EntityTable>, current: Entity) {
  const values = { ...params, updatedAt: new Date().toISOString() };
  const record = { ...current, ...values };
  const result = validateEntity(record);
  if (!result.success) return result;
  await c.updateTable("entities").set(values).where("id", "=", current.id).executeTakeFirstOrThrow();
  const updated = await findEntityByIdOrThrow(c, current.id);
  return success(updated);
}
```

## Utilities from `~/data`

### Result Type (`~/data/result`)

Use for business logic errors (validation failures, etc.). Never throw exceptions for expected errors.

```typescript
import { success, failure } from "~/data/result";

// Return failure for validation errors
if (!name) return failure("Name is required.");

// Return success with the value
return success(created);

// Check result before proceeding
const result = validateEntity(record);
if (!result.success) return result;  // Propagate failure
```

### ID Generation (`~/data/id`)

Generate ULID (time-sortable, 26 characters) for new records.

```typescript
import { generateId } from "~/data/id";

const id = generateId<EntityId>();  // Type-safe ID generation
```

## Rules

- Return validation errors using Result type (`success`/`failure`)
- Async validation (e.g., uniqueness check) in command.ts
- Exclude sensitive fields in `encodeToPublic*` functions
- Use `generateId<EntityId>()` for ID generation
