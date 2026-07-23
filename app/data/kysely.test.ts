import type { Generated } from "kysely";
import { assert, beforeAll, test } from "vitest";
import { db } from "~/adapters/db/client";
import { withTransaction } from "./kysely";
import { failure, success } from "./result";

const testDb = db.$extendTables<{
  kyselyTests: { id: Generated<number>; name: string };
}>();

beforeAll(async () => {
  await testDb.schema
    .createTable("kysely_tests")
    .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
    .addColumn("name", "text", (col) => col.notNull())
    .execute();
});

test("withTransaction commits on success", async () => {
  const result = await withTransaction(testDb, async (trx) => {
    await trx.insertInto("kyselyTests").values({ name: "tx-commit" }).execute();
    return success("committed");
  });
  assert(result.success);
  assert(result.value === "committed");
  assert(await findRecordByName("tx-commit"));
});

test("withTransaction rolls back on failure", async () => {
  const result = await withTransaction(testDb, async (trx) => {
    await trx
      .insertInto("kyselyTests")
      .values({ name: "tx-failure" })
      .execute();
    return failure("Something went wrong.");
  });
  assert(!result.success);
  assert(result.message === "Something went wrong.");
  assert(!(await findRecordByName("tx-failure")));
});

test("withTransaction rolls back on thrown error", async () => {
  let thrown: unknown;
  try {
    await withTransaction(testDb, async (trx) => {
      await trx
        .insertInto("kyselyTests")
        .values({ name: "tx-throw" })
        .execute();
      throw new Error("boom");
    });
  } catch (error) {
    thrown = error;
  }
  assert(thrown instanceof Error && thrown.message === "boom");
  assert(!(await findRecordByName("tx-throw")));
});

test("withTransaction joins an existing transaction", async () => {
  const result = await withTransaction(testDb, async (trx) => {
    await trx
      .insertInto("kyselyTests")
      .values({ name: "tx-nest-outer" })
      .execute();
    return withTransaction(trx, async (trx2) => {
      await trx2
        .insertInto("kyselyTests")
        .values({ name: "tx-nest-inner" })
        .execute();
      return success(undefined);
    });
  });
  assert(result.success);
  assert(await findRecordByName("tx-nest-outer"));
  assert(await findRecordByName("tx-nest-inner"));
});

test("nested failure rolls back the whole transaction when propagated", async () => {
  const result = await withTransaction(testDb, async (trx) => {
    await trx
      .insertInto("kyselyTests")
      .values({ name: "tx-nest-fail-outer" })
      .execute();
    const innerResult = await withTransaction(trx, async (trx2) => {
      await trx2
        .insertInto("kyselyTests")
        .values({ name: "tx-nest-fail-inner" })
        .execute();
      return failure("Inner failed.");
    });
    if (!innerResult.success) return innerResult;
    return success(undefined);
  });
  assert(!result.success);
  assert(!(await findRecordByName("tx-nest-fail-outer")));
  assert(!(await findRecordByName("tx-nest-fail-inner")));
});

async function findRecordByName(name: string) {
  return testDb
    .selectFrom("kyselyTests")
    .selectAll()
    .where("name", "=", name)
    .executeTakeFirst();
}
