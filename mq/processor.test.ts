import { assert, test } from "vitest";

import { createProcessor } from "./processor";

test("createProcessor dispatches to the handler matching job.name", async () => {
  const received: Array<unknown> = [];
  const processor = createProcessor({
    async greet(payload: { to: string }) {
      received.push(payload);
    },
  });

  await processor({ name: "greet", data: { to: "world" } });

  assert(received.length === 1);
  assert.deepEqual(received[0], { to: "world" });
});

test("createProcessor throws on an unknown job name", async () => {
  const processor = createProcessor({});

  let error: unknown;
  try {
    await processor({ name: "nope", data: {} });
  } catch (e) {
    error = e;
  }

  assert(error instanceof Error);
  assert(error.message === "Unknown job name: nope");
});
