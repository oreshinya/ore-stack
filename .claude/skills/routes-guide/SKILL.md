---
name: routes-guide
description: Use when creating or modifying pages, screens, endpoints, loaders, actions, or form handling. Under app/routes/.
user-invocable: false
---

# Routes Rules

## Responsibilities

Manage React Router route definitions.

## Directory Structure

```
app/routes/
└── {path}/              # Use the URL path as-is
    ├── _route.tsx       # HTML structure
    ├── loader.ts        # Data loading (GET)
    ├── action.ts        # Data mutation (POST)
    ├── hook.tsx         # Behavior (React hooks)
    └── styles.module.css # Styling
```

### Example
```
app/routes/
├── samples/
│   ├── _index/
│   │   └── loader.ts           # GET /samples
│   ├── $id/
│   │   ├── _index/
│   │   │   └── loader.ts       # GET /samples/:id
│   │   └── edit/
│   │       ├── action.ts       # POST /samples/:id/edit
│   │       └── loader.ts       # GET /samples/:id/edit
│   └── new/
│       └── action.ts           # POST /samples/new
└── _index/
    └── loader.ts               # GET /
```

## loader.ts

Fetches data for GET requests.

### Implementation Pattern

```typescript
import { db } from "~/adapters/db/client";
import { encodeToPublicSample } from "~/models/sample/entity";
import { findAllSamples } from "~/models/sample/query";
import type { Route } from "./+types/_route";

export async function loader(_: Route.LoaderArgs) {
  const samples = await findAllSamples(db);
  return { samples: samples.map(encodeToPublicSample) };
}
```

## action.ts

Handles data mutations for POST requests.

### Implementation Pattern

```typescript
import { redirect } from "react-router";
import * as v from "valibot";
import { db } from "~/adapters/db/client";
import { decodeForm } from "~/data/decodable-schema";
import { data400 } from "~/data/response";
import { createSample } from "~/models/sample/command";
import { t } from "~/router-contexts/locale";
import type { Route } from "./+types/_route";

const FormSchema = v.object({
  name: v.string(),
  active: v.pipe(
    v.optional(v.picklist(["on", "off"]), "off"),
    v.transform((value): 0 | 1 => (value === "on" ? 1 : 0)),
  ),
});

export async function action({ request, context }: Route.ActionArgs) {
  const decodeResult = await decodeForm(request, FormSchema);
  if (!decodeResult.success) {
    return data400(t(context, decodeResult.message));
  }

  const result = await createSample(db, decodeResult.value);
  if (!result.success) {
    return data400(t(context, result.message));
  }

  return redirect(`/samples/${result.value.id}`);
}
```

## _route.tsx

Defines the route's HTML structure. Write React hooks in `hook.tsx`, not in `_route.tsx`.

Only `_route.tsx` is registered as a route, so re-export `loader.ts` / `action.ts` from `_route.tsx`.

### Implementation Pattern

```typescript
import { Form } from "react-router";
import { m } from "~/translations";
import type { Route } from "./+types/_route";
import { useHook } from "./hook";

export { action } from "./action";

export default function SampleNew({ actionData }: Route.ComponentProps) {
  const { t } = useHook();

  return (
    <>
      <title>{t(m.ui.sample.creation.title)}</title>
      <Form method="post">
        {actionData?.message && <p>{actionData.message}</p>}
        <input type="text" name="name" required />
        <input type="checkbox" name="active" />
        <button type="submit">{t(m.ui.sample.creation.create)}</button>
      </Form>
    </>
  );
}
```

- Implement forms as uncontrolled by default
  - Put logic in `hook.tsx` only when control is needed (e.g. client-side validation)

## hook.tsx / styles.module.css

Separate structure, behavior, and styling into their own files. Put all React hook logic in `hook.tsx`. See the components-guide skill for details.

## Decoding

Convert external data into TypeScript types using valibot schemas and the helpers below.
Use valibot only for type checking and normalization (e.g. `v.trim()`), not for validating values (e.g. email format).

- **Form data**: `decodeForm(request, schema)`
- **URL params**: `decodeWithLogging(schema, params)`
- **Query params**: `decodeQuery(request, schema)`
- **JSON body**: `decodeJson(request, schema)`

## Encoding

Convert server-side data into a form that is safe for the client.

```typescript
return { samples: samples.map(encodeToPublicSample) };
```

## Error Handling

```typescript
// 404 - Resource not found (throw an exception)
if (!sample) throw res404();

// 400 - Decode failure or business logic error (return a response)
if (!result.success) return data400(t(context, result.message));
```
