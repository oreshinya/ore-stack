---
name: adapters-guide
description: Adapters module patterns and table definitions. Use when working with database tables, external APIs, or adapter configurations.
user-invocable: false
---

# Adapters Rules

## Responsibilities

Handle connections and configurations for external systems (databases, APIs, external services).

- Initialize and configure external system clients
- Define data schemas and types
- Provide external system-specific utility functions

## Directory Structure

```
app/adapters/
├── db/                 # Database adapter
│   ├── client.ts       # DB client initialization
│   ├── database.ts     # Database type definition
│   └── tables/         # Table definitions
│       ├── table-base.ts
│       ├── sample.ts
│       └── ...
├── github/             # GitHub API adapter (example)
│   └── client.ts
├── slack/              # Slack API adapter (example)
│   └── client.ts
└── s3/                 # S3 storage adapter (example)
    └── client.ts
```

Separate directories by external system (e.g., `db/`, `github/`, `slack/`, `s3/`).

## Table Definition (`app/adapters/db/tables/*.ts`)

```typescript
import { type Expression, type ExpressionBuilder, expressionBuilder } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/sqlite";
import * as v from "valibot";
import type { TableBase } from "./table-base";

export interface SampleTable extends TableBase<SampleId> {
  name: string;
  active: boolean;
}

export type SampleId = v.InferOutput<typeof SampleIdSchema>;

export const SampleIdSchema = v.pipe(v.string(), v.brand("SampleId"));

export type SampleEb = ExpressionBuilder<{ samples: SampleTable }, "samples">;

// Relation helper: Load nested data using jsonObjectFrom
// Usage: .select((eb) => [withSample(eb.ref("orders.sampleId")).as("sample")])
// Note: Always use explicit .select([...]) - SQLite does not support selectAll() in json_object
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
  active: () => (eb: SampleEb) => eb("samples.active", "=", true),
};
```

## Scaffolding

Generate table definition:

```bash
pnpm sscg table -r <name> -o app/adapters/db/tables
```

After generation, register the new table in `app/adapters/db/database.ts`.

