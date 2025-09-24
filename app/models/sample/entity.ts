import type { Selectable } from "kysely";
import type { SampleTable } from "~/adapters/db/tables/sample";

export type Sample = Selectable<SampleTable>;

export function encode(sample: Sample) {
  const { id } = sample;
  return { id };
}
