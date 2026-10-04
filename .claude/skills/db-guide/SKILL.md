---
name: db-guide
description: Use when creating or modifying Kysely table definitions, relations, scopes, or ID types. Under app/adapters/db/.
user-invocable: false
---

# DB Rules

## Responsibilities

Manage the database connection, schema definitions, and table definitions.

## Directory Structure

```
app/adapters/db/
├── client.ts       # DB client initialization
├── database.ts     # Database type definitions
└── tables/         # Table definitions
    ├── table-base.ts
    ├── sample.ts
    └── ...
```

## Notes

- Because of `CamelCasePlugin`, define property names in camelCase (they are automatically converted to snake_case on the DB side)
- Use branded types only for table IDs

## Table Base Types (`table-base.ts`)

- `TableBase<Id>`: provides `id`, `createdAt`, and `updatedAt`, common to all tables
- `CreateParams<Table>`: type for inserts (excludes `id`, `createdAt`, `updatedAt`)
- `UpdateParams<Table>`: type for updates (excludes `id`, `createdAt`, `updatedAt`)

## Table Definitions (`app/adapters/db/tables/*.ts`)

```typescript
import { type Expression, type ExpressionBuilder, expressionBuilder } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/sqlite";
import * as v from "valibot";
import type { TableBase } from "./table-base";

export interface SampleTable extends TableBase<SampleId> {
  name: string;
  active: 0 | 1;
}

export type SampleId = v.InferOutput<typeof SampleIdSchema>;

export const SampleIdSchema = v.pipe(v.string(), v.brand("SampleId"));

export type SampleEb = ExpressionBuilder<{ samples: SampleTable }, "samples">;

// Relation helper: loads nested data using jsonObjectFrom
// Usage: .select((eb) => [withSample(eb.ref("orders.sampleId")).as("sample")])
// Note: always use an explicit .select([...]) - SQLite does not support selectAll() inside json_object
export function withSample(sampleId: Expression<SampleId>) {
  const eb: SampleEb = expressionBuilder();
  return jsonObjectFrom(
    eb
      .selectFrom("samples")
      .select([
        "samples.id",
        "samples.name",
        "samples.active",
        "samples.createdAt",
        "samples.updatedAt",
      ])
      .whereRef("samples.id", "=", sampleId),
  ).$notNull();
}

export const scope = {
  active: () => (eb: SampleEb) => eb("samples.active", "=", 1),
};
```
