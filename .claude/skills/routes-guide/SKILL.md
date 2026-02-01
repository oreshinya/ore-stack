---
name: routes-guide
description: Routes module patterns for HTTP handling. Use when creating loaders, actions, or route components.
user-invocable: false
---

# Routes Rules

## Responsibilities

Handle React Router route definitions.

## Directory Structure

```
app/routes/
└── {path}/              # URL path as-is
    ├── _route.tsx       # HTML structure
    ├── loader.ts        # Data loading (GET)
    ├── action.ts        # Data updates (POST)
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

Fetch data for GET requests.

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

Handle data mutations for POST requests.

### Implementation Pattern

```typescript
import { redirect } from "react-router";
import * as v from "valibot";
import { db } from "~/adapters/db/client";
import { decodeForm } from "~/data/decodable-schema";
import { data400 } from "~/data/response";
import { createSample } from "~/models/sample/command";
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

  const result = await createSample(db, decodeResult.value);
  if (!result.success) return data400(result.message);

  return redirect(`/samples/${result.value.id}`);
}
```

## _route.tsx

Define the HTML structure for the route. React hooks must be in `hook.tsx`, not in `_route.tsx`.

### Implementation Pattern

```typescript
import { Form } from "react-router";
import type { Route } from "./+types/_route";
import { useHook } from "./hook";

export { loader } from "./loader";
export { action } from "./action";

export default function SampleNew({ loaderData, actionData }: Route.ComponentProps) {
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

## hook.tsx / styles.module.css

Separate structure, behavior, and styling into respective files. Place all React hooks logic in `hook.tsx`. See components-guide skill for details.

## Decoding

Convert external data to TypeScript types.

- **Form data**: `decodeForm(request, schema)`
- **URL parameters**: `decodeWithLogging(schema, params)`
- **Query parameters**: `decodeQuery(request, schema)`
- **JSON body**: `decodeJson(request, schema)`

## Encoding

Convert server-side data to client-safe format.

```typescript
return { samples: samples.map(encodeToPublicSample) };
```

## Error Handling

```typescript
// 404 - Resource not found (throw exception)
if (!sample) throw res404();

// 400 - Decode failure or business logic error (return response)
if (!result.success) return data400(result.message);
```

## Scaffolding

Generate route files:

```bash
pnpm sscg route -r <name> -o app/routes/<path>
```

