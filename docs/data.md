# Data Rules

## Responsibilities

Provide shared data structures and utilities across the application.

Place data-type-focused utilities that are not dependent on specific domains or layers.

**Currently includes**:
- Result type (success/failure representation)
- HTTP response helpers
- ID generation logic
- Validation helpers

## Directory Structure

```
app/data/
├── result.ts            # Result type
├── response.ts          # HTTP response helpers
├── id.ts               # ID generation
└── decodable-schema.ts # Validation helpers
```

## Result Type (`result.ts`)

Return business logic errors (validation failures, etc.) using the Result type.

```typescript
import { success, failure } from "~/data/result";

function validate(name: string) {
  if (!name) return failure("Name is required.");
  return success(name);
}

const result = validate(sample);
if (!result.success) return result;
```

## HTTP Response Helpers (`response.ts`)

```typescript
// 404 - Resource not found
if (!sample) throw res404();

// 400 - Decode failure or business logic error
if (!result.success) return data400(result.message);
```

## ID Generation (`id.ts`)

Generate ULID (time-sortable, 26 characters).

```typescript
const id = generateId<SampleId>();
```

## Decode Helpers (`decodable-schema.ts`)

- `decodeForm(request, schema)` - Form data
- `decodeJson(request, schema)` - JSON body
- `decodeQuery(request, schema)` - Query parameters
- `decodeWithLogging(schema, params)` - URL parameters (logs in development)
