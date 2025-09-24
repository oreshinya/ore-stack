import type { ExpressionBuilder } from "kysely";
import * as v from "valibot";
import type { TableBase } from "./table-base";

export interface SampleTable extends TableBase<SampleId> {
  name: string;
  active: boolean;
}

export type SampleId = v.InferOutput<typeof SampleIdSchema>;

export const SampleIdSchema = v.pipe(v.string(), v.brand("SampleId"));

type Eb = ExpressionBuilder<{ samples: SampleTable }, "samples">;

export const scope = {
  active(eb: Eb) {
    return eb("active", "=", true);
  },
};
