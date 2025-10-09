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
    ├── index.tsx        # Component implementation
    ├── hook.tsx         # Custom hook (optional)
    └── styles.module.css # Styles (optional)
```

## index.tsx

```typescript
import type { ComponentProps } from "react";

interface Props extends ComponentProps<"button"> {
  variant?: "primary" | "secondary";
  loading?: boolean;
}

export function Button({ variant = "primary", loading, children, ...props }: Props) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
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

## Template (sscg)

```bash
pnpm sscg component -r sample-card -o app/components/sample-card
```

