import type { Selectable } from "kysely";
import type { SampleTable } from "~/adapters/db/tables/sample";
import type { CreateParams } from "~/adapters/db/tables/table-base";
import { failure, success } from "~/data/result";
import { m } from "~/translations";

const NAME_MAX_LENGTH = 255;

export type Sample = Selectable<SampleTable>;

export function validateSample(params: CreateParams<SampleTable>) {
  const { name } = params;
  if (!name) return failure(m.err.sample.nameRequired);
  if (name.length > NAME_MAX_LENGTH) {
    return failure(m.err.sample.nameTooLong({ max: NAME_MAX_LENGTH }));
  }
  return success(params);
}

export function encodeToPublicSample(sample: Sample) {
  const { id, name, active } = sample;
  return { id, name, active };
}

export type PublicSample = ReturnType<typeof encodeToPublicSample>;
