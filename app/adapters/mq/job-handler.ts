export type JobHandler<Payload = never> = (
  payload: Payload,
) => Promise<unknown>;
