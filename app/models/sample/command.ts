import type { DBClient } from "~/adapters/db/client";
import type { SampleId, SampleTable } from "~/adapters/db/tables/sample";
import type {
  CreateParams,
  UpdateParams,
} from "~/adapters/db/tables/table-base";
import { generateId } from "~/data/id";
import { success } from "~/data/result";
import type { Sample } from "./entity";

export async function createSample(
  c: DBClient,
  params: CreateParams<SampleTable>,
) {
  // TODO: validate params here...
  const id = generateId<SampleId>();
  const now = new Date().toISOString();
  const record = { id, ...params, createdAt: now, updatedAt: now };
  await c.insertInto("samples").values(record).executeTakeFirstOrThrow();
  return success(record);
}

export async function updateSample(
  c: DBClient,
  current: Sample,
  params: UpdateParams<SampleTable>,
) {
  // TODO: validate params here...
  const values = { ...params, updatedAt: new Date().toISOString() };
  await c
    .updateTable("samples")
    .set(values)
    .where("id", "=", current.id)
    .executeTakeFirstOrThrow();
  return success({ ...current, ...values });
}
