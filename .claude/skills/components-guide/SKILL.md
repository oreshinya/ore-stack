---
name: components-guide
description: Components module patterns for reusable UI. Use when creating React components with hooks and styles.
user-invocable: false
---

# Components Rules

## Responsibilities

Provide reusable UI components.

- Generic UI components
- No business logic
- Used across multiple routes

## Directory Structure

```
app/components/
└── {component-name}/    # kebab-case
    ├── index.tsx        # HTML structure
    ├── hook.tsx         # Behavior (React hooks)
    └── styles.module.css # Styling
```

Separate structure, behavior, and styling into respective files.

## index.tsx

Define the component structure. React hooks must be in `hook.tsx`, not in `index.tsx`.

```typescript
import type { ComponentProps } from "react";
import { useHook } from "./hook";

interface Props extends ComponentProps<"button"> {
  variant?: "primary" | "secondary";
  loading?: boolean;
}

export function Button({ variant = "primary", loading, children, ...props }: Props) {
  const { isDisabled } = useHook();

  return (
    <button
      {...props}
      disabled={loading || props.disabled || isDisabled}
      className={`button button--${variant}`}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}
```

## hook.tsx

```typescript
import { useState } from "react";

function useToggle(initialValue: boolean) {
  const [value, setValue] = useState(initialValue);
  const toggle = () => setValue((v) => !v);
  return { value, toggle };
}

export function useHook() {
  const toggle = useToggle(false);
  // Can combine other logic
  return { toggle };
}
```

Export only `useHook` as the function name.

## styles.module.css

```css
.button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

.primary {
  background-color: blue;
  color: white;
}

.secondary {
  background-color: gray;
  color: white;
}
```

```typescript
import classNames from "classnames/bind";
import styles from "./styles.module.css";

const cx = classNames.bind(styles);

export function Button({ variant = "primary", children }: Props) {
  return (
    <button className={cx("button", variant)}>
      {children}
    </button>
  );
}
```

Use **kebab-case** for class names. Combine class names with `classnames/bind`.

## Scaffolding

Generate component files:

```bash
pnpm sscg component -r <name> -o app/components/<name>
```

