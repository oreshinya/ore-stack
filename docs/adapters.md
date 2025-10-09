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
import type { ExpressionBuilder } from "kysely";
import * as v from "valibot";
import type { TableBase } from "./table-base";

export interface SampleTable extends TableBase<SampleId> {
  name: string;
  active: boolean;
}

export type SampleId = v.InferOutput<typeof SampleIdSchema>;

export const SampleIdSchema = v.pipe(v.string(), v.brand("SampleId"));

export type SampleEb = ExpressionBuilder<{ samples: SampleTable }, "samples">;

export const scope = {
  active(eb: SampleEb) {
    return eb("active", "=", true);
  },
};
```

## Template (sscg)

```bash
pnpm sscg table -r user -o app/adapters/db/tables
```

