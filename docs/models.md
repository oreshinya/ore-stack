# Models Rules

## Responsibilities

Handle domain logic and data access.

## Directory Structure

```
app/models/
└── {entity}/           # Entity name (singular)
    ├── entity.ts       # Entity type definitions and related functions
    ├── query.ts        # Read operations
    └── command.ts      # Write operations
```

## entity.ts

Place entity type definitions and related functions.

```typescript
import type { Selectable } from "kysely";
import type { SampleTable } from "~/adapters/db/tables/sample";
import type { CreateParams } from "~/adapters/db/tables/table-base";
import { failure, success } from "~/data/result";

export type Sample = Selectable<SampleTable>;

export function validateSample(params: CreateParams<SampleTable>) {
  const { name } = params;
  if (!name) return failure("Name is required.");
  if (name.length > 255) return failure("Name must not exceed 255 characters.");
  return success(params);
}

export function encodeToPublicSample(sample: Sample) {
  const { id, name, active } = sample;
  return { id, name, active };
}

export type PublicSample = ReturnType<typeof encodeToPublicSample>;
```

## query.ts

Perform data read operations.

```typescript
import type { DBClient } from "~/adapters/db/client";
import type { SampleId } from "~/adapters/db/tables/sample";

export async function findSampleById(c: DBClient, id: SampleId) {
  return await c
    .selectFrom("samples")
    .selectAll("samples")
    .where("id", "=", id)
    .executeTakeFirst();
}

export async function findSampleByIdOrThrow(c: DBClient, id: SampleId) {
  return await c
    .selectFrom("samples")
    .selectAll("samples")
    .where("id", "=", id)
    .executeTakeFirstOrThrow();
}

export async function findAllSamples(c: DBClient) {
  return await c
    .selectFrom("samples")
    .selectAll("samples")
    .orderBy("id", "desc")
    .execute();
}

export async function findSampleByName(c: DBClient, name: string) {
  return await c
    .selectFrom("samples")
    .selectAll("samples")
    .where("name", "=", name)
    .executeTakeFirst();
}
```

## command.ts

Perform data write operations.

```typescript
import type { DBClient } from "~/adapters/db/client";
import type { SampleId, SampleTable } from "~/adapters/db/tables/sample";
import type { CreateParams, UpdateParams } from "~/adapters/db/tables/table-base";
import { generateId } from "~/data/id";
import { failure, success } from "~/data/result";
import { type Sample, validateSample } from "./entity";
import { findSampleByIdOrThrow, findSampleByName } from "./query";

export async function createSample(c: DBClient, params: CreateParams<SampleTable>) {
  const id = generateId<SampleId>();
  const now = new Date().toISOString();
  const record = { id, ...params, createdAt: now, updatedAt: now };
  const result = validateSample(record);
  if (!result.success) return result;
  const result2 = await asyncValidateSample(c, record);
  if (!result2.success) return result2;
  await c.insertInto("samples").values(record).executeTakeFirstOrThrow();
  const created = await findSampleByIdOrThrow(c, id);
  return success(created);
}

export async function updateSample(c: DBClient, params: UpdateParams<SampleTable>, current: Sample) {
  const values = { ...params, updatedAt: new Date().toISOString() };
  const record = { ...current, ...values };
  const result = validateSample(record);
  if (!result.success) return result;
  const result2 = await asyncValidateSample(c, record, current);
  if (!result2.success) return result2;
  await c.updateTable("samples").set(values).where("id", "=", current.id).executeTakeFirstOrThrow();
  const updated = await findSampleByIdOrThrow(c, current.id);
  return success(updated);
}

export async function asyncValidateSample(
  c: DBClient,
  params: CreateParams<SampleTable>,
  current?: Sample,
) {
  const existing = await findSampleByName(c, params.name);
  if (existing && existing.id !== current?.id) {
    return failure("Name already exists.");
  }
  return success(params);
}
```

## Template (sscg)

```bash
# For database-backed models
pnpm sscg db-model -r user -o app/models/user

# For other data sources
pnpm sscg model -r user -o app/models/user
```

## Best Practices

- **Result type consistency**: Always return validation errors using Result type and propagate to upper layers (Routes)
- **Validation**: Implement business rules beyond data source constraints
- **Encoding**: Exclude sensitive information from client responses
