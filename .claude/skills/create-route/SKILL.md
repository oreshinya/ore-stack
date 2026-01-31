---
name: create-route
description: Create a new route with loader, action, and UI components
---

# Create Route

Create a new route with loader, action, and UI components.

## Usage

```
/create-route <route-name> <path>
```

Example: `/create-route users-new users/new`

## Steps

1. Run template generator:
   ```bash
   pnpm sscg route -r <route-name> -o app/routes/<path>
   ```

2. Customize generated files

3. Add route to `app/routes.ts` if needed

## File Structure

```
app/routes/<path>/
├── _route.tsx       # HTML structure (re-exports loader/action)
├── loader.ts        # Data loading (GET)
├── action.ts        # Data mutations (POST)
├── hook.tsx         # React hooks
└── styles.module.css # Styling
```

## loader.ts Pattern

```typescript
import { db } from "~/adapters/db/client";
import { encodeToPublicEntity } from "~/models/entity/entity";
import { findAllEntities } from "~/models/entity/query";
import type { Route } from "./+types/_route";

export async function loader(_: Route.LoaderArgs) {
  const entities = await findAllEntities(db);
  return { entities: entities.map(encodeToPublicEntity) };
}
```

### With URL Parameters

```typescript
import { db } from "~/adapters/db/client";
import { EntityIdSchema } from "~/adapters/db/tables/entity";
import { decodeWithLogging } from "~/data/decodable-schema";
import { res404 } from "~/data/response";
import { findEntityById } from "~/models/entity/query";
import type { Route } from "./+types/_route";

const ParamsSchema = v.object({ id: EntityIdSchema });

export async function loader({ params }: Route.LoaderArgs) {
  const { id } = decodeWithLogging(ParamsSchema, params);
  const entity = await findEntityById(db, id);
  if (!entity) throw res404();
  return { entity };
}
```

## action.ts Pattern

```typescript
import { redirect } from "react-router";
import * as v from "valibot";
import { db } from "~/adapters/db/client";
import { decodeForm } from "~/data/decodable-schema";
import { data400 } from "~/data/response";
import { createEntity } from "~/models/entity/command";
import type { Route } from "./+types/_route";

const FormSchema = v.object({
  name: v.string(),
  active: v.pipe(
    v.optional(v.picklist(["on", "off"]), "off"),
    v.transform((value) => value === "on"),
  ),
});

export async function action({ request }: Route.ActionArgs) {
  const decodeResult = await decodeForm(request, FormSchema);
  if (!decodeResult.success) return data400(decodeResult.message);

  const result = await createEntity(db, decodeResult.value);
  if (!result.success) return data400(result.message);

  return redirect(`/entities/${result.value.id}`);
}
```

## _route.tsx Pattern

```typescript
import { Form } from "react-router";
import type { Route } from "./+types/_route";
import { useHook } from "./hook";

export { loader } from "./loader";
export { action } from "./action";

export default function EntityNew({ loaderData, actionData }: Route.ComponentProps) {
  const { value, handleChange } = useHook();

  return (
    <Form method="post">
      {actionData?.message && <p>{actionData.message}</p>}
      <input type="text" name="name" value={value} onChange={handleChange} required />
      <input type="checkbox" name="active" />
      <button type="submit">Create</button>
    </Form>
  );
}
```

## hook.tsx Pattern

```typescript
import { useState } from "react";

export function useHook() {
  const [value, setValue] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  return { value, handleChange };
}
```

Export only `useHook` as the function name.

## styles.module.css Pattern

```css
.container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.error-message {
  color: red;
}
```

## Utilities from `~/data`

### Decode Helpers (`~/data/decodable-schema`)

Convert external data to TypeScript types with validation. All return `Result` type.

```typescript
import { decodeForm, decodeJson, decodeQuery, decodeWithLogging } from "~/data/decodable-schema";

// Form data (POST body)
const result = await decodeForm(request, FormSchema);
if (!result.success) return data400(result.message);

// JSON body (API requests)
const result = await decodeJson(request, JsonSchema);

// Query parameters (?page=1&limit=10)
const result = decodeQuery(request, QuerySchema);

// URL parameters (params from route)
const { id } = decodeWithLogging(ParamsSchema, params);  // Throws on failure
```

### Response Helpers (`~/data/response`)

```typescript
import { res404, data400 } from "~/data/response";

// 404 - Resource not found (throw exception)
if (!entity) throw res404();

// 400 - Decode failure or business logic error (return response)
if (!result.success) return data400(result.message);
```

**When to use which:**
- `throw res404()` - Missing resource, should show 404 page
- `return data400(message)` - User input error, show message in form

## Rules

- React hooks must be in `hook.tsx`, not in `_route.tsx`
- Use `styles.module.css` with `classnames/bind` for styling
- Class names in CSS: kebab-case
- Always encode server data before returning to client
