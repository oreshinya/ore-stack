import type { Selectable } from "kysely";
import type { SampleTable } from "~/adapters/db/tables/sample";
import type { CreateParams } from "~/adapters/db/tables/table-base";
import { failure, success } from "~/data/result";

export type Sample = Selectable<SampleTable>;

export function validateSample(params: CreateParams<SampleTable>) {
  const { name } = params;
  if (!name) return failure("Name is required.");
  if (name.length > 255) return failure("Name must not exceed 255 characters.");
  return success(params);
}

export function encodeToPublicSample(sample: Sample) {
  const { id, name, active } = sample;
  return { id, name, active };
}

export type PublicSample = ReturnType<typeof encodeToPublicSample>;
