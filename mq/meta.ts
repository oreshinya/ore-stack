import type { ConnectionOptions } from "bullmq";

import { REDIS_URL } from "~env";

export const QUEUE_NAME = "default";

export const connection: ConnectionOptions = {
  url: REDIS_URL,
};
