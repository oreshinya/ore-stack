import { Queue } from "bullmq";

import { connection, QUEUE_NAME } from "./meta";

export const queue = new Queue(QUEUE_NAME, {
  connection,
  defaultJobOptions: {
    attempts: 10,
    backoff: { type: "exponential", delay: 10_000 },
    removeOnComplete: { age: 24 * 3600, count: 1000 },
    removeOnFail: { age: 7 * 24 * 3600, count: 5000 },
  },
});
