import type { Selectable } from "kysely";
import type { SampleTable } from "~/adapters/db/tables/sample";
import { failure, success } from "~/data/result";

export type Sample = Selectable<SampleTable>;

export function validateSample(sample: Pick<Sample, "name" | "active">) {
  const { name } = sample;
  if (!name) return failure("Name is required.");
  if (name.length > 255) return failure("Name must not exceed 255 characters.");
  return success(sample);
}

export function encodeSample(sample: Sample) {
  const { id, name, active } = sample;
  return { id, name, active };
}
