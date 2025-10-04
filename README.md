<div align="center">

# ore-stack

A React Router template with structured architecture.

</div>

## Tech Stack

- [React Router](https://reactrouter.com/) (Framework mode)
- [libSQL](https://turso.tech/) + [Kysely](https://kysely.dev/)
- [Valibot](https://valibot.dev/)
- [Vitest](https://vitest.dev/)
- [Biome](https://biomejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Claude Code](https://claude.com/product/claude-code)
- [GitHub Actions](https://github.com/features/actions)
- [Docker](https://www.docker.com/)

## Documentation

See `docs/` for detailed guidelines:

- [docs/guidelines.md](docs/guidelines.md) - Overall structure and coding conventions
- [docs/adapters.md](docs/adapters.md) - External system connections
- [docs/data.md](docs/data.md) - Shared data structures
- [docs/models.md](docs/models.md) - Domain logic and data access
- [docs/routes.md](docs/routes.md) - HTTP routing and UI
- [docs/components.md](docs/components.md) - Reusable UI components

## Usage

```bash
pnpm dlx create-react-router@latest my-react-router-app --template https://github.com/oreshinya/ore-stack
```

## Setup

### Install dependencies

```bash
pnpm install
```

### Run database migrations

```bash
pnpm tsx tasks/db.ts up
```

### Remove sample code (optional)

```bash
pnpm tsx tasks/remove-samples.ts
```

## Development

### Start development server

```bash
pnpm dev
```

### Type check

```bash
pnpm typecheck
```

### Lint and fix

```bash
pnpm lint:fix
```

### Run tests

```bash
pnpm test
```

## Production

### Build

```bash
pnpm build
```

This creates:
- `build/` - React Router application (built with Vite)
- `dist/` - Server and tasks (built with esbuild)

### Start server

```bash
pnpm start:server
```

### Run tasks

```bash
node dist/tasks-{task-name}.js
```
