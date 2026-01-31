---
name: create-component
description: Create a new reusable UI component
---

# Create Component

Create a new reusable UI component.

## Usage

```
/create-component <component-name>
```

Example: `/create-component sample-card`

## Steps

1. Run template generator:
   ```bash
   pnpm sscg component -r <component-name> -o app/components/<component-name>
   ```

2. Customize generated files

## File Structure

```
app/components/<component-name>/
├── index.tsx        # HTML structure
├── hook.tsx         # React hooks
└── styles.module.css # Styling
```

## index.tsx Pattern

```typescript
import type { ComponentProps } from "react";
import classNames from "classnames/bind";
import { useHook } from "./hook";
import styles from "./styles.module.css";

const cx = classNames.bind(styles);

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
      className={cx("button", variant)}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}
```

## hook.tsx Pattern

```typescript
import { useState } from "react";

function useToggle(initialValue: boolean) {
  const [value, setValue] = useState(initialValue);
  const toggle = () => setValue((v) => !v);
  return { value, toggle };
}

export function useHook() {
  const toggle = useToggle(false);
  return { isDisabled: toggle.value };
}
```

Export only `useHook` as the function name.

## styles.module.css Pattern

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

## Rules

- Component names: kebab-case for directories
- Class names in CSS: kebab-case
- Use `classnames/bind` for combining class names
- React hooks must be in `hook.tsx`, not in `index.tsx`
- No business logic - components should be generic and reusable
- Extend native element props when appropriate (e.g., `ComponentProps<"button">`)
