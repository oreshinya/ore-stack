import type { JobHandler } from "../job-handler";

// TODO: Remove this sample job when implementing the first real job.
export const sample: JobHandler<{ message: string }> = async (payload) => {
  console.log(`Sample job received: ${payload.message}`);
};
