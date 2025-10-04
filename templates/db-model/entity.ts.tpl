import type { Selectable } from "kysely";
import type { {{pascalCase(singular(t))}}Table } from "~/adapters/db/tables/{{kebabCase(singular(t))}}";

export type {{pascalCase(singular(t))}} = Selectable<{{pascalCase(singular(t))}}Table>;

export function encodeToPublic{{pascalCase(singular(t))}}({{camelCase(singular(t))}}: {{pascalCase(singular(t))}}) {
  const { id } = {{camelCase(singular(t))}};
  return { id };
}

export type Public{{pascalCase(singular(t))}} = ReturnType<typeof encodeToPublic{{pascalCase(singular(t))}}>;
