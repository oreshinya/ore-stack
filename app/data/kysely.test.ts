import { assert, test } from "vitest";
import { db } from "~/adapters/db/client";
import type { SampleId } from "~/adapters/db/tables/sample";
import { generateId } from "./id";
import { withTransaction } from "./kysely";
import { failure, success } from "./result";

test("withTransaction commits on success", async () => {
  const record = buildSample("tx-commit");
  const result = await withTransaction(db, async (trx) => {
    await trx.insertInto("samples").values(record).execute();
    return success(record.id);
  });
  assert(result.success);
  assert(result.value === record.id);
  assert(await findSample(record.id));
});

test("withTransaction rolls back on failure", async () => {
  const record = buildSample("tx-failure");
  const result = await withTransaction(db, async (trx) => {
    await trx.insertInto("samples").values(record).execute();
    return failure("Something went wrong.");
  });
  assert(!result.success);
  assert(result.message === "Something went wrong.");
  assert(!(await findSample(record.id)));
});

test("withTransaction rolls back on thrown error", async () => {
  const record = buildSample("tx-throw");
  let thrown: unknown;
  try {
    await withTransaction(db, async (trx) => {
      await trx.insertInto("samples").values(record).execute();
      throw new Error("boom");
    });
  } catch (error) {
    thrown = error;
  }
  assert(thrown instanceof Error && thrown.message === "boom");
  assert(!(await findSample(record.id)));
});

test("withTransaction joins an existing transaction", async () => {
  const outer = buildSample("tx-nest-outer");
  const inner = buildSample("tx-nest-inner");
  const result = await withTransaction(db, async (trx) => {
    await trx.insertInto("samples").values(outer).execute();
    return withTransaction(trx, async (trx2) => {
      await trx2.insertInto("samples").values(inner).execute();
      return success(undefined);
    });
  });
  assert(result.success);
  assert(await findSample(outer.id));
  assert(await findSample(inner.id));
});

test("nested failure rolls back the whole transaction when propagated", async () => {
  const outer = buildSample("tx-nest-fail-outer");
  const inner = buildSample("tx-nest-fail-inner");
  const result = await withTransaction(db, async (trx) => {
    await trx.insertInto("samples").values(outer).execute();
    const innerResult = await withTransaction(trx, async (trx2) => {
      await trx2.insertInto("samples").values(inner).execute();
      return failure("Inner failed.");
    });
    if (!innerResult.success) return innerResult;
    return success(undefined);
  });
  assert(!result.success);
  assert(!(await findSample(outer.id)));
  assert(!(await findSample(inner.id)));
});

function buildSample(name: string) {
  const now = new Date().toISOString();
  return {
    id: generateId<SampleId>(),
    name,
    active: 1 as const,
    createdAt: now,
    updatedAt: now,
  };
}

async function findSample(id: SampleId) {
  return db
    .selectFrom("samples")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirst();
}
