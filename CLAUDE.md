# Project Rules

Coding conventions and architecture patterns for this project.

## Tech Stack

React Router (Framework mode), libSQL + Kysely, Valibot, Vitest, Biome, TypeScript (strict)

## Core Modules

- **Adapters** (`app/adapters/`): External system connections and configurations
- **Models** (`app/models/`): Domain logic and data access
- **Routes** (`app/routes/`): HTTP request handling and UI rendering
- **Components** (`app/components/`): Reusable UI components
- **Data** (`app/data/`): Shared primitives organized by data type, not by domain or layer

## Path Resolution

- `~/`: app directory (`import { db } from "~/adapters/db/client";`)
- `~env`: environment variables (`import { NODE_ENV } from "~env";`)
- Same directory: relative path `./`

## File and Directory Naming

- Use **kebab-case** (e.g., `sample-model.ts`)
- `_route.tsx`: route component, `_index`: index route
- `*.test.ts`: test files, `*.module.css`: CSS modules

## Coding Guidelines

- Do not explicitly type function return values (rely on type inference)
- Compute derived values on the server side (except for real-time values)
- Use `start <= t < end` for time ranges (00:00:00 instead of 23:59:59)

## Error Handling

- **Business logic errors**: return Result type
- **Unexpected system errors**: throw exceptions

## Result Type

Return business logic errors (validation failures, etc.) using the Result type.

```typescript
import { success, failure } from "~/data/result";

function validate(name: string) {
  if (!name) return failure("Name is required.");
  return success(name);
}

const result = validate(sample);
if (!result.success) return result;
```

## Testing

- Location: same directory as the test target (`*.test.ts`)
- Prefer `assert` over `expect`

## Static Assets

Assets are stored in `app/assets/`.

- `app/assets/icons/` - UI icons
- `app/assets/logos/` - Logo images
- `app/assets/illustrations/` - Illustration images
