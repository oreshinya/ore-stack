# Models Layer Rules

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
import { failure, success } from "~/data/result";

export type Sample = Selectable<SampleTable>;

export function validateSample(sample: Pick<Sample, "name" | "active">) {
  const { name } = sample;
  if (!name) return failure("Name is required.");
  if (name.length > 255) return failure("Name must not exceed 255 characters.");
  return success(sample);
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
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirst();
}

export async function findAllSamples(c: DBClient) {
  return await c
    .selectFrom("samples")
    .selectAll()
    .orderBy("id", "desc")
    .execute();
}
```

## command.ts

Perform data write operations.

```typescript
import type { DBClient } from "~/adapters/db/client";
import type { SampleId, SampleTable } from "~/adapters/db/tables/sample";
import type { CreateParams, UpdateParams } from "~/adapters/db/tables/table-base";
import { generateId } from "~/data/id";
import { success } from "~/data/result";
import { type Sample, validateSample } from "./entity";

export async function createSample(c: DBClient, params: CreateParams<SampleTable>) {
  const id = generateId<SampleId>();
  const now = new Date().toISOString();
  const record = { id, ...params, createdAt: now, updatedAt: now };
  const result = validateSample(record);
  if (!result.success) return result;
  await c.insertInto("samples").values(record).executeTakeFirstOrThrow();
  return success(record);
}

export async function updateSample(c: DBClient, current: Sample, params: UpdateParams<SampleTable>) {
  const values = { ...params, updatedAt: new Date().toISOString() };
  const record = { ...current, ...values };
  const result = validateSample(record);
  if (!result.success) return result;
  await c.updateTable("samples").set(values).where("id", "=", current.id).executeTakeFirstOrThrow();
  return success(record);
}
```

## Template (sscg)

```bash
# For database-backed models
sscg db-model -r user -o app/models/user

# For other data sources
sscg model -r user -o app/models/user
```

## Best Practices

- **Result type consistency**: Always return validation errors using Result type and propagate to upper layers (Routes)
- **Validation**: Implement business rules beyond data source constraints
- **Encoding**: Exclude sensitive information from client responses
