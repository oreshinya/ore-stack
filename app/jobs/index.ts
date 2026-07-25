import type { JobHandler } from "~/adapters/mq/job-handler";
import { deliverMail } from "./deliver-mail";

export const registry = {
  deliverMail,
} satisfies Record<string, JobHandler>;

type Registry = typeof registry;

export type JobName = keyof Registry;

export type JobPayload<T extends JobName> = Parameters<Registry[T]>[0];
