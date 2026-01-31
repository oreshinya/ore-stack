# Project Rules

React Router + Kysely + Valibot + Vitest + Biome + TypeScript (strict)

## Skills (Slash Commands)

Use these commands for common tasks:

- `/create-table <name>` - Create database table definition
- `/create-model <name>` - Create model (entity, query, command)
- `/create-route <name> <path>` - Create route with loader/action
- `/create-component <name>` - Create UI component
- `/migrate <command>` - Database migrations (create, up, latest, down)
- `/verify` - Run typecheck, lint, and tests

## Architecture

```
app/
├── adapters/     # External system connections (DB, APIs)
├── models/       # Domain logic and data access
├── routes/       # HTTP handlers and UI
├── components/   # Reusable UI components
├── data/         # Shared utilities (Result型, ID生成, レスポンス, デコード)
└── assets/       # Static assets (icons, logos, illustrations)
```

## Conventions

### Naming
- Files/directories: **kebab-case**
- DB identifiers: **snake_case**
- Route files: `_route.tsx`, `loader.ts`, `action.ts`
- Tests: `*.test.ts` (same directory as source)

### Imports
- `~/` - app directory
- `~env` - environment variables
- `./` - same directory

### Error Handling
- Business errors: return `Result` type (`success`/`failure`)
- System errors: throw exceptions

### Code Style
- Rely on type inference (don't explicitly type return values)
- Compute derived values server-side
- Time ranges: `start <= t < end`
- Tests: prefer `assert` over `expect`

## Implementation Flow

1. Plan tasks
2. Generate files with sscg or skills
3. Create migrations if needed (`/migrate create <name>`)
4. Write tests
5. Verify (`/verify`)
