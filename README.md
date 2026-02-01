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

See [CLAUDE.md](CLAUDE.md) for coding conventions and architecture patterns.

## Usage

```bash
pnpm dlx create-react-router@latest my-react-router-app --template https://github.com/oreshinya/ore-stack
```

## Setup

### Install dependencies

```bash
pnpm install
```

### Remove sample code

```bash
pnpm tsx tasks/remove-samples.ts
```

### Run database migrations

```bash
pnpm tsx tasks/db.ts latest
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
