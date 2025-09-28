import { db } from "~/adapters/db/client";
import { encodeSample } from "~/models/sample/entity";
import { findAllSamples } from "~/models/sample/query";
import type { Route } from "./+types/_route";

export async function loader(_: Route.LoaderArgs) {
  const samples = await findAllSamples(db);
  return { samples: samples.map(encodeSample) };
}
