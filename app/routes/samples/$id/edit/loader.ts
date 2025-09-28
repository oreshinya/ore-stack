import * as v from "valibot";
import { db } from "~/adapters/db/client";
import { SampleIdSchema } from "~/adapters/db/tables/sample";
import { decodeWithLogging } from "~/data/decodable-schema";
import { res404 } from "~/data/response";
import { encodeSample } from "~/models/sample/entity";
import { findSampleById } from "~/models/sample/query";
import type { Route } from "./+types/_route";

const ParamsSchema = v.object({
  id: SampleIdSchema,
});

export async function loader({ params }: Route.LoaderArgs) {
  const result = await decodeWithLogging(ParamsSchema, params);
  if (!result.success) throw res404();

  const sample = await findSampleById(db, result.value.id);
  if (!sample) throw res404();

  return { sample: encodeSample(sample) };
}
