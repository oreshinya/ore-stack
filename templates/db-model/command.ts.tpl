import type { DBClient } from "~/adapters/db/client";
import type { {{pascalCase(singular(t))}}Id, {{pascalCase(singular(t))}}Table } from "~/adapters/db/tables/{{kebabCase(singular(t))}}";
import type {
  CreateParams,
  UpdateParams,
} from "~/adapters/db/tables/table-base";
import { generateId } from "~/data/id";
import { success } from "~/data/result";
import type { {{pascalCase(singular(t))}} } from "./entity";

export async function create{{pascalCase(singular(t))}}(
  c: DBClient,
  params: CreateParams<{{pascalCase(singular(t))}}Table>,
) {
  // TODO: validate params here...
  const id = generateId<{{pascalCase(singular(t))}}Id>();
  const now = new Date().toISOString();
  const record = { id, ...params, createdAt: now, updatedAt: now };
  await c.insertInto("{{camelCase(plural(t))}}").values(record).executeTakeFirstOrThrow();
  return success(record);
}

export async function update{{pascalCase(singular(t))}}(
  c: DBClient,
  current: {{pascalCase(singular(t))}},
  params: UpdateParams<{{pascalCase(singular(t))}}Table>,
) {
  // TODO: validate params here...
  const values = { ...params, updatedAt: new Date().toISOString() };
  await c
    .updateTable("{{camelCase(plural(t))}}")
    .set(values)
    .where("id", "=", current.id)
    .executeTakeFirstOrThrow();
  return success({ ...current, ...values });
}
