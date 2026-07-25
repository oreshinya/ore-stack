import { Worker } from "bullmq";
import closeWithGrace from "close-with-grace";

import { connection, QUEUE_NAME } from "~/adapters/mq/meta";
import { registry } from "~/jobs";
import { MQ_CONCURRENCY } from "~env";
import { createProcessor } from "./processor";

const worker = new Worker(QUEUE_NAME, createProcessor(registry), {
  connection,
  concurrency: MQ_CONCURRENCY,
});

worker.on("ready", () => {
  console.log(`Worker is listening on queue "${QUEUE_NAME}"`);
});

worker.on("failed", (job, error) => {
  console.error(`Job failed: ${job?.name} (${job?.id})`, error);
});

worker.on("error", (error) => {
  console.error("Worker error:", error);
});

closeWithGrace(async () => {
  await worker.close();
});
