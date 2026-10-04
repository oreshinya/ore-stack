---
name: translations-guide
description: Use when creating or modifying translation catalogs, UI/error messages, or locale resolution. Under app/translations/.
user-invocable: false
---

# Translations Rules

## Responsibilities

Manage translation catalogs for multilingual support.

## Writing Catalogs

```typescript
import type { Translation } from "./index";

export const en = {
  err: {
    sample: {
      nameRequired: "Name is required.",
      nameTooLong: ({ max }: { max: number }) =>
        `Name must not exceed ${max} characters.`,
    },
  },
  ui: {
    common: {
      backToList: "Back to list",
    },
    sample: {
      common: {
        name: "Name",
      },
      list: {
        title: "Samples",
      },
    },
  },
} satisfies Translation;
```

- Nesting of 2-3 levels is recommended
- Use separate entries when the same text serves different roles

## Adding a Language

1. Create `app/translations/{locale}.ts` and export a catalog with the same shape as `en`
2. Add an entry to `translations` in `index.ts`

```typescript
const translations = { en, ja } satisfies Record<string, typeof en>;
```
