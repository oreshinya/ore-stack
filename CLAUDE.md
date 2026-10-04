# Project Rules

## Tech Stack

React Router (Framework mode), libSQL + Kysely, BullMQ + Valkey, Resend, Valibot, Vitest, Biome, TypeScript (strict), pnpm

## Directory Structure

```
app/
  adapters/       # External service integrations (including DB)
  assets/         # Static assets
    icons/        # UI icons
    logos/        # Logo images
    illustrations/ # Illustration images
  components/     # Shared UI components
  contexts/       # React Context
  data/           # Shared data types (Result, ID, etc.)
  hooks/          # Shared React hooks
  jobs/           # Async jobs
  mails/          # Mail content definitions
  models/         # Domain logic
  router-contexts/ # React Router context (shared with the Express layer)
  routes/         # Pages and API endpoints
  translations/   # Translation catalogs
docker/           # Docker-related config
env/              # Environment variable definitions
libsql/           # libSQL database files
migrations/       # DB migrations
mq/               # Worker entry point
server/           # Server entry point
tasks/            # Batch processing tasks
templates/        # Code generation templates
test/             # Test setup
```

## Path Resolution

- `~/`: the app directory (`import { db } from "~/adapters/db/client";`)
- `~env`: environment variables (`import { NODE_ENV } from "~env";`)
- Same directory: relative path `./`

## Naming Conventions

- File and directory names use **kebab-case** (e.g. `sample-model.ts`)

## Coding Guidelines

- Use only `GET` and `POST`
- Generally don't write function return types (let them be inferred)
  - You may write them when they can't be inferred, when they would become `any`, or when you want to make the interface explicit
- Express time ranges consistently as `start <= t < end` (use 00:00:00, not 23:59:59)
- Don't define types with the same name as globally available types (e.g. `Response`)
- Don't use reserved words (such as `type`) as column or property names
- Don't lie about types with type assertions (`as`)
  - Narrowing from `any` / `unknown` (e.g. API responses) to a concrete type is not lying, so `as` is allowed there
  - In any other case where you use `as`, leave a comment explaining why
- Write function parameter names in full without abbreviating domain terms, since they are part of the interface
- Store times as ISO 8601 strings; for comparisons and calculations in TS code, convert them to `Date`
- Open transactions with `withTransaction`
- Put UI and error messages in the catalog and reference them via `m`. Resolve them to strings at the boundary
  - Server (loader / action): `t(context, translatable)`
  - Client: `t(translatable)` returned by `useTranslate()`
- Don't reference server-only environment variables (`~env`) from code that ends up in the client bundle
- Placement of definitions:
  - Prioritize relatedness above all (place types and constants that are paired or derived from each other next to each other)
  - Order types from coarsest to finest granularity (composite types → their constituents → primitives)
  - Only configuration constants that don't belong to anything else (limits, fixed strings, etc.) are grouped right after the import statements
  - Place private (non-exported) functions at the bottom of the file
- Don't write comments stating the obvious
  - When you do write comments, always write them in English

## Error Handling

- **Business logic errors**: return a Result type
- **Unexpected system errors**: throw an exception

```typescript
import { success, failure } from "~/data/result";
import { m } from "~/translations";

function validate(name: string) {
  if (!name) return failure(m.err.sample.nameRequired);
  return success(name);
}

const result = validate(sample);
if (!result.success) return result;
```

## Skills

Consult the relevant guide skills even while still refining a plan. Treat whatever the guides already decide as given, without asking the user.
