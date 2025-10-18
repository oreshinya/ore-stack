import type { DBClient } from "~/adapters/db/client";
import type { {{pascalCase(singular(t))}}Id, {{pascalCase(singular(t))}}Table } from "~/adapters/db/tables/{{kebabCase(singular(t))}}";
import type {
  CreateParams,
  UpdateParams,
} from "~/adapters/db/tables/table-base";
import { generateId } from "~/data/id";
import { success } from "~/data/result";
import type { {{pascalCase(singular(t))}} } from "./entity";
import { find{{pascalCase(singular(t))}}ByIdOrThrow } from "./query";

export async function create{{pascalCase(singular(t))}}(
  c: DBClient,
  params: CreateParams<{{pascalCase(singular(t))}}Table>,
) {
  const id = generateId<{{pascalCase(singular(t))}}Id>();
  const now = new Date().toISOString();
  const record = { id, ...params, createdAt: now, updatedAt: now };
  // TODO: validate params here...
  await c.insertInto("{{camelCase(plural(t))}}").values(record).executeTakeFirstOrThrow();
  const created = await find{{pascalCase(singular(t))}}ByIdOrThrow(c, id);
  return success(created);
}

export async function update{{pascalCase(singular(t))}}(
  c: DBClient,
  params: UpdateParams<{{pascalCase(singular(t))}}Table>,
  current: {{pascalCase(singular(t))}},
) {
  const values = { ...params, updatedAt: new Date().toISOString() };
  const record = { ...current, ...values };
  // TODO: validate params here...
  await c
    .updateTable("{{camelCase(plural(t))}}")
    .set(values)
    .where("id", "=", current.id)
    .executeTakeFirstOrThrow();
  const updated = await find{{pascalCase(singular(t))}}ByIdOrThrow(c, current.id);
  return success(updated);
}
