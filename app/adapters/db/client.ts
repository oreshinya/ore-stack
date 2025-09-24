import { LibsqlDialect, type LibsqlDialectConfig } from "@libsql/kysely-libsql";
import { CamelCasePlugin, Kysely } from "kysely";
import { DB_TOKEN, DB_URL, NODE_ENV } from "~env";
import type { Database } from "./database";

const config: LibsqlDialectConfig = { url: DB_URL };
if (DB_TOKEN) config.authToken = DB_TOKEN;

export type DBClient = Kysely<Database>;

export const db: DBClient = new Kysely<Database>({
  dialect: new LibsqlDialect(config),
  plugins: [new CamelCasePlugin()],
  log: NODE_ENV === "development" ? ["query"] : [],
});
