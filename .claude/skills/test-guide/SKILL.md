---
name: test-guide
description: Use when creating or modifying tests. *.test.ts files.
user-invocable: false
---

# Test Rules

## File Placement

Place tests as `*.test.ts` in the same directory as the code under test.

```
app/models/sample/
├── command.ts
└── command.test.ts
```

## Writing Tests

- Prefer `assert` over `expect`
- Define test cases with the `test` function
- In tests that use the DB, use `db` imported from `~/adapters/db/client` as-is
- `test/setup.ts` runs DB migrations automatically, so no setup code is needed in tests
- `test/setup.ts` automatically mocks `enqueue` from `~/adapters/mq/client`, so no mocking is needed in tests

```typescript
import { assert, test } from "vitest";
import { db } from "~/adapters/db/client";
import { m } from "~/translations";
import { createSample } from "./command";

test("createSample", async () => {
  const result = await createSample(db, { name: "test", active: 1 });
  assert(result.success);
  assert(result.value.name === "test");

  const result2 = await createSample(db, { name: "", active: 1 });
  assert(!result2.success);
  assert(result2.message === m.err.sample.nameRequired);
});
```
