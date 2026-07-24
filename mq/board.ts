import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";

import { queue } from "./queue";

export function createMqBoard(basePath: string) {
  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath(basePath);
  createBullBoard({
    queues: [new BullMQAdapter(queue)],
    serverAdapter,
  });
  return serverAdapter.getRouter();
}
