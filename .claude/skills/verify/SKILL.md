---
name: verify
description: Run type checking, linting, and tests
---

# Verify

Run type checking, linting, and tests.

## Usage

```
/verify
```

## What It Does

Runs the following checks in sequence:

1. **Type Check** - TypeScript compilation check
2. **Lint Fix** - Auto-fix linting issues with Biome
3. **Test** - Run all tests with Vitest

## Command

```bash
pnpm typecheck && pnpm lint:fix && pnpm test
```

## Individual Commands

```bash
# Type check only
pnpm typecheck

# Lint check (no auto-fix)
pnpm lint

# Lint with auto-fix
pnpm lint:fix

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch
```

## When to Use

Run `/verify` after:
- Implementing new features
- Fixing bugs
- Refactoring code
- Before committing changes

## Troubleshooting

### Type Errors
- Check import paths (use `~/` for app directory)
- Ensure table definitions match model types
- Verify Valibot schema types

### Lint Errors
- Most issues are auto-fixed by `lint:fix`
- For persistent errors, check Biome configuration

### Test Failures
- Tests are located next to source files (`*.test.ts`)
- Use `assert` over `expect`
- Check test isolation - each test should be independent
