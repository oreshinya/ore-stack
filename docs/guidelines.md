# Guidelines

This project follows a layered architecture pattern.

## Core Modules

- **Data** (`app/data/`): Shared data structures and utilities
- **Adapters** (`app/adapters/`): External system connections and configurations
- **Models** (`app/models/`): Domain logic and data access
- **Routes** (`app/routes/`): HTTP request handling and UI rendering
- **Components** (`app/components/`): Reusable UI components

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

## Testing

- Location: same directory as the test target (`*.test.ts`)

## Implementation Flow

1. Understand requirements and plan necessary tasks
2. Implement (generate files with sscg if needed)
3. Write tests
4. Run `pnpm typecheck && pnpm lint:fix && pnpm test`

## Tech Stack

React Router (Framework mode), libSQL + Kysely, Valibot, Vitest, Biome, TypeScript (strict)

## Module-Specific Rules

- **Adapters** (`app/adapters/`): @adapters.md
- **Data** (`app/data/`): @data.md
- **Models** (`app/models/`): @models.md
- **Routes** (`app/routes/`): @routes.md
- **Components** (`app/components/`): @components.md
