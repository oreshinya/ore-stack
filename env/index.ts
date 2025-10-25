import { num } from "./utils";

export const NODE_ENV = process.env["NODE_ENV"] || "development";

export const HOST = process.env["HOST"] || "http://localhost:3000";

export const BIND_ADDRESS = process.env["BIND_ADDRESS"] || "127.0.0.1";

export const PORT = num(process.env["PORT"] || "3000");

export const ASSET_HOST = process.env["ASSET_HOST"] || "/";

export const DB_URL = process.env["DB_URL"] || "file:libsql/local.db";

export const DB_TOKEN = process.env["DB_TOKEN"];

export const BASIC_AUTH_USER = process.env["BASIC_AUTH_USER"];

export const BASIC_AUTH_PASSWORD = process.env["BASIC_AUTH_PASSWORD"];
