import type { Kysely } from "kysely";
import type { Result } from "./result";

export async function withTransaction<T, U extends Result<unknown>>(
  c: Kysely<T>,
  fn: (trx: Kysely<T>) => Promise<U>,
) {
  if (c.isTransaction) return fn(c);
  const trx = await c.startTransaction().execute();
  try {
    const result = await fn(trx);
    if (result.success) {
      await trx.commit().execute();
    } else {
      await trx.rollback().execute();
    }
    return result;
  } catch (error) {
    await trx.rollback().execute();
    throw error;
  }
}
