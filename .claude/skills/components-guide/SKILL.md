---
name: components-guide
description: Use when creating or modifying shared UI components (under app/components/), or the hook.tsx / styles.module.css of components and routes. Shared hooks in app/hooks/ are out of scope.
user-invocable: false
---

# Components Rules

## Responsibilities

Provide reusable UI components.

- General-purpose UI components
- Contain no business logic
- Used by multiple routes

## Directory Structure

```
app/components/
└── {component-name}/    # kebab-case
    ├── index.tsx        # HTML structure
    ├── hook.tsx         # Behavior (React hooks)
    └── styles.module.css # Styling
```

Separate structure, behavior, and styling into their own files.

## index.tsx

Defines the component's structure. Write React hooks in `hook.tsx`, not in `index.tsx`. Use `classnames/bind` to combine class names.

```typescript
import classNames from "classnames/bind";
import type { ComponentProps } from "react";
import { m } from "~/translations";
import { useHook } from "./hook";
import styles from "./styles.module.css";

const cx = classNames.bind(styles);

interface Props extends ComponentProps<"button"> {
  variant?: "primary" | "secondary";
  loading?: boolean;
}

export function Button({ variant = "primary", loading, children, ...props }: Props) {
  const { isDisabled, t } = useHook();

  return (
    <button
      {...props}
      disabled={loading || props.disabled || isDisabled}
      className={cx("button", variant)}
    >
      {loading ? t(m.ui.common.loading) : children}
    </button>
  );
}
```

## hook.tsx

Defines the component's behavior. The only exported function is `useHook`.
Keeping everything in one hook instead of splitting it into separate hooks avoids exposing internal logic to index.tsx.

```typescript
import { useTranslate } from "~/hooks/use-translate";

export function useHook() {
  const t = useTranslate();
  // ...
  return { t };
}
```

## styles.module.css

Use CSS Modules. Use **kebab-case** for class names.
