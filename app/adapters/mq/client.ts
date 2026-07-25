import type { JobsOptions } from "bullmq";

import type { JobName, JobPayload } from "~/jobs";
import { queue } from "./queue";

export function enqueue<T extends JobName>(
  name: T,
  payload: JobPayload<T>,
  options?: JobsOptions,
) {
  return queue.add(name, payload, options);
}
