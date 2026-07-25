import type { JobHandler } from "~/adapters/mq/job-handler";

export function createProcessor(registry: Record<string, JobHandler>) {
  return async (job: { name: string; data: unknown }) => {
    const handler = registry[job.name];
    if (!handler) {
      throw new Error(`Unknown job name: ${job.name}`);
    }
    // job.data is deserialized JSON from Redis. The typed enqueue in client.ts
    // guarantees it matches the handler's payload type.
    await handler(job.data as never);
  };
}
