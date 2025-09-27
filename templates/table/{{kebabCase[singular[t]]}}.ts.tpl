import type { ExpressionBuilder } from "kysely";
import * as v from "valibot";
import type { TableBase } from "./table-base";

export interface {{pascalCase(singular(t))}}Table extends TableBase<{{pascalCase(singular(t))}}Id> {
}

export type {{pascalCase(singular(t))}}Id = v.InferOutput<typeof {{pascalCase(singular(t))}}IdSchema>;

export const {{pascalCase(singular(t))}}IdSchema = v.pipe(v.string(), v.brand("{{pascalCase(singular(t))}}Id"));

export type {{pascalCase(singular(t))}}Eb = ExpressionBuilder<{ {{camelCase(plural(t))}}: {{pascalCase(singular(t))}}Table }, "{{camelCase(plural(t))}}">;

export const scope = {
};
