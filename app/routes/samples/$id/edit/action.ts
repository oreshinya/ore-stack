import { redirect } from "react-router";
import * as v from "valibot";
import { db } from "~/adapters/db/client";
import { SampleIdSchema } from "~/adapters/db/tables/sample";
import { decodeForm, decodeWithLogging } from "~/data/decodable-schema";
import { data400, res404 } from "~/data/response";
import { updateSample } from "~/models/sample/command";
import { findSampleById } from "~/models/sample/query";
import type { Route } from "./+types/_route";

const ParamsSchema = v.object({
  id: SampleIdSchema,
});

const FormSchema = v.object({
  name: v.string(),
  active: v.pipe(
    v.optional(v.picklist(["on", "off"]), "off"),
    v.transform((value) => value === "on"),
  ),
});

export async function action({ request, params }: Route.ActionArgs) {
  const paramsResult = await decodeWithLogging(ParamsSchema, params);
  if (!paramsResult.success) throw res404();

  const sample = await findSampleById(db, paramsResult.value.id);
  if (!sample) throw res404();

  const decodeResult = await decodeForm(request, FormSchema);
  if (!decodeResult.success) {
    return data400(decodeResult.message);
  }

  const result = await updateSample(db, decodeResult.value, sample);
  if (!result.success) {
    return data400(result.message);
  }

  return redirect(`/samples/${result.value.id}`);
}
