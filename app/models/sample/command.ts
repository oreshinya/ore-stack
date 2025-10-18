import type { DBClient } from "~/adapters/db/client";
import type { SampleId, SampleTable } from "~/adapters/db/tables/sample";
import type {
  CreateParams,
  UpdateParams,
} from "~/adapters/db/tables/table-base";
import { generateId } from "~/data/id";
import { failure, success } from "~/data/result";
import { type Sample, validateSample } from "./entity";
import { findSampleByIdOrThrow, findSampleByName } from "./query";

export async function createSample(
  c: DBClient,
  params: CreateParams<SampleTable>,
) {
  const id = generateId<SampleId>();
  const now = new Date().toISOString();
  const record = { id, ...params, createdAt: now, updatedAt: now };
  const result = validateSample(record);
  if (!result.success) return result;
  const result2 = await asyncValidateSample(c, record);
  if (!result2.success) return result2;
  await c.insertInto("samples").values(record).executeTakeFirstOrThrow();
  const created = await findSampleByIdOrThrow(c, id);
  return success(created);
}

export async function updateSample(
  c: DBClient,
  params: UpdateParams<SampleTable>,
  current: Sample,
) {
  const values = { ...params, updatedAt: new Date().toISOString() };
  const record = { ...current, ...values };
  const result = validateSample(record);
  if (!result.success) return result;
  const result2 = await asyncValidateSample(c, record, current);
  if (!result2.success) return result2;
  await c
    .updateTable("samples")
    .set(values)
    .where("id", "=", current.id)
    .executeTakeFirstOrThrow();
  const updated = await findSampleByIdOrThrow(c, current.id);
  return success(updated);
}

export async function asyncValidateSample(
  c: DBClient,
  params: CreateParams<SampleTable>,
  current?: Sample,
) {
  const existing = await findSampleByName(c, params.name);
  if (existing && existing.id !== current?.id) {
    return failure("Name already exists.");
  }
  return success(params);
}
