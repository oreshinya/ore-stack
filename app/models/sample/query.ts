import type { DBClient } from "~/adapters/db/client";
import type { SampleId } from "~/adapters/db/tables/sample";

export async function findSampleById(c: DBClient, id: SampleId) {
  return await c
    .selectFrom("samples")
    .selectAll("samples")
    .where("id", "=", id)
    .executeTakeFirst();
}

export async function findSampleByIdOrThrow(c: DBClient, id: SampleId) {
  return await c
    .selectFrom("samples")
    .selectAll("samples")
    .where("id", "=", id)
    .executeTakeFirstOrThrow();
}

export async function findAllSamples(c: DBClient) {
  return await c
    .selectFrom("samples")
    .selectAll("samples")
    .orderBy("id", "desc")
    .execute();
}

export async function findSampleByName(c: DBClient, name: string) {
  return await c
    .selectFrom("samples")
    .selectAll("samples")
    .where("name", "=", name)
    .executeTakeFirst();
}
