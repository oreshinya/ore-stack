---
name: jobs-guide
description: Use when creating or modifying async jobs under app/jobs/, and when writing code that enqueues jobs with enqueue.
user-invocable: false
---

# Jobs Rules

## Responsibilities

Define async jobs that run on the BullMQ worker.

## How to Write

- One job per file. Define it as a plain async function annotated with `JobHandler<Payload>`
- Define the Payload type inline in the generic position, without going through an interface declaration
- Once created, register it in the registry in `index.ts`

```typescript
import { db } from "~/adapters/db/client";
import { deleteExpiredSessions } from "~/models/session/command";
import type { JobHandler } from "~/adapters/mq/job-handler";

export const cleanupSessions: JobHandler<{ before: string }> = async (
  payload,
) => {
  await deleteExpiredSessions(db, payload.before);
};
```

## Payload

- Payloads remain in the queue as plain text, so pass only references such as IDs and non-sensitive values; don't include personal or confidential information
- Payloads are serialized as JSON, so don't pass `Date` and the like as-is; convert them to ISO strings

## Enqueueing

- Use `enqueue` from `~/adapters/mq/client`. Leave retries to the queue defaults
