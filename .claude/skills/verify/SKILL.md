---
name: verify
description: Run type checking, linting, and tests to verify code quality
user-invocable: false
---

Verify code quality by running the following checks.

## Command

```bash
pnpm typecheck && pnpm lint:fix && pnpm test
```

## Individual Commands

- `pnpm typecheck` - Type checking
- `pnpm lint:fix` - Lint and auto-fix
- `pnpm test` - Run tests
