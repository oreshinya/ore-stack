import type { JobHandler } from "../job-handler";
import { sample } from "./sample";

export const registry = {
  sample,
} satisfies Record<string, JobHandler>;

type Registry = typeof registry;

export type JobName = keyof Registry;

export type JobPayload<T extends JobName> = Parameters<Registry[T]>[0];
