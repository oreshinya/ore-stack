import { redirect } from "react-router";
import * as v from "valibot";
import { db } from "~/adapters/db/client";
import { decodeForm } from "~/data/decodable-schema";
import { data400 } from "~/data/response";
import { createSample } from "~/models/sample/command";
import type { Route } from "./+types/_route";

const FormSchema = v.object({
  name: v.string(),
  active: v.pipe(
    v.optional(v.picklist(["on", "off"]), "off"),
    v.transform((value) => value === "on"),
  ),
});

export async function action({ request }: Route.ActionArgs) {
  const decodeResult = await decodeForm(request, FormSchema);
  if (!decodeResult.success) {
    return data400(decodeResult.message);
  }

  const result = await createSample(db, decodeResult.value);
  if (!result.success) {
    return data400(result.message);
  }

  return redirect(`/samples/${result.value.id}`);
}
