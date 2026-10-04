---
name: run-checks
description: Use when you finish creating or modifying code. Verifies quality with type checking, linting, and tests.
---

Run the following checks in order to verify code quality.

1. `pnpm typecheck` — Type checking
2. `pnpm lint:fix` — Lint and auto-fix
3. `pnpm test` — Run tests

## Handling Errors

If any step fails, review the errors, fix them, and rerun from step 1. Repeat until all checks pass.
