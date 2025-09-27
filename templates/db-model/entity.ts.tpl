import type { Selectable } from "kysely";
import type { {{pascalCase(singular(t))}}Table } from "~/adapters/db/tables/{{kebabCase(singular(t))}}";

export type {{pascalCase(singular(t))}} = Selectable<{{pascalCase(singular(t))}}Table>;

export function encode{{pascalCase(singular(t))}}({{kebabCase(singular(t))}}: {{pascalCase(singular(t))}}) {
  const { id } = {{kebabCase(singular(t))}};
  return { id };
}
