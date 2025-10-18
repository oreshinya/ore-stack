import type { DBClient } from "~/adapters/db/client";
import type { {{pascalCase(singular(t))}}Id } from "~/adapters/db/tables/{{kebabCase(singular(t))}}";

export async function find{{pascalCase(singular(t))}}ById(c: DBClient, id: {{pascalCase(singular(t))}}Id) {
  return await c
    .selectFrom("{{camelCase(plural(t))}}")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirst();
}

export async function find{{pascalCase(singular(t))}}ByIdOrThrow(c: DBClient, id: {{pascalCase(singular(t))}}Id) {
  return await c
    .selectFrom("{{camelCase(plural(t))}}")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirstOrThrow();
}
