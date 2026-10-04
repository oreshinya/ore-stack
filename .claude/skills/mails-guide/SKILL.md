---
name: mails-guide
description: Use when creating or modifying mail content (composers) or mail-sending logic. Under app/mails/.
user-invocable: false
---

# Mails Rules

## Responsibilities

Define mail content. A composer takes params, fetches the data it needs from the DB, and builds and returns a `Mail`.

## How to Write

- One mail per file. Define it as a plain async function annotated with `MailComposer<Params>`
- Define the Params type inline in the generic position, without going through an interface declaration
- Composers are re-run on retries, so keep them read-only
- Build the `Mail` with `buildMail`
- Once created, register it in the registry in `index.ts`

```typescript
import { db } from "~/adapters/db/client";
import type { UserId } from "~/adapters/db/tables/user";
import { buildMail, type MailComposer } from "~/adapters/mailer/mail";
import { findUserByIdOrThrow } from "~/models/user/query";

export const welcome: MailComposer<{ userId: UserId }> = async ({ userId }) => {
  const user = await findUserByIdOrThrow(db, userId);
  return buildMail({
    to: user.email,
    subject: "Your registration is complete",
    text: `Dear ${user.name},\n…`,
  });
};
```

## Sending

- Don't call `sendMail` directly; have the worker deliver mail via `enqueue("deliverMail", { mailName, params })`
- Params remain in the queue as plain text, so pass only references such as IDs and non-sensitive values; don't include personal or confidential information
