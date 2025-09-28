import type { DBClient } from "~/adapters/db/client";
import type { SampleId } from "~/adapters/db/tables/sample";

export async function findSampleById(c: DBClient, id: SampleId) {
  return await c
    .selectFrom("samples")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirst();
}

export async function findAllSamples(c: DBClient) {
  return await c
    .selectFrom("samples")
    .selectAll()
    .orderBy("id", "desc")
    .execute();
}
