import type { DBClient } from "~/adapters/db/client";
import type { SampleId, SampleTable } from "~/adapters/db/tables/sample";
import type {
  CreateParams,
  UpdateParams,
} from "~/adapters/db/tables/table-base";
import { generateId } from "~/data/id";
import { success } from "~/data/result";
import { type Sample, validateSample } from "./entity";

export async function createSample(
  c: DBClient,
  params: CreateParams<SampleTable>,
) {
  const id = generateId<SampleId>();
  const now = new Date().toISOString();
  const record = { id, ...params, createdAt: now, updatedAt: now };
  const result = validateSample(record);
  if (!result.success) return result;
  await c.insertInto("samples").values(record).executeTakeFirstOrThrow();
  return success(record);
}

export async function updateSample(
  c: DBClient,
  current: Sample,
  params: UpdateParams<SampleTable>,
) {
  const values = { ...params, updatedAt: new Date().toISOString() };
  const record = { ...current, ...values };
  const result = validateSample(record);
  if (!result.success) return result;
  await c
    .updateTable("samples")
    .set(values)
    .where("id", "=", current.id)
    .executeTakeFirstOrThrow();
  return success(record);
}
