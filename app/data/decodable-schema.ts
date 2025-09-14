import qs from "qs";
import * as v from "valibot";
import { NODE_ENV } from "~env";
import { failure, success } from "./result";

export type DecodableSchema =
  | v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>
  | v.BaseSchemaAsync<unknown, unknown, v.BaseIssue<unknown>>;

export async function decodeWithLogging<TSchema extends DecodableSchema>(
  schema: TSchema,
  data: unknown,
) {
  if (NODE_ENV === "development") {
    console.log("Before decoding: ↓");
    console.log(data);
  }
  const result = await v.safeParseAsync(schema, data, { abortEarly: true });
  if (!result.success) {
    return failure(result.issues[0].message);
  }
  if (NODE_ENV === "development") {
    console.log("After decoded: ↓");
    console.log(result.output);
  }
  return success(result.output);
}

export async function decodeForm<TSchema extends DecodableSchema>(
  request: Request,
  schema: TSchema,
) {
  const formData = await request.formData();

  const form = Object.fromEntries(
    [...formData.keys()].map((key) => {
      if (key.endsWith("[]")) return [key.slice(0, -2), formData.getAll(key)];

      return [key, formData.get(key)];
    }),
  );

  return decodeWithLogging(schema, form);
}

export async function decodeJson<TSchema extends DecodableSchema>(
  request: Request,
  schema: TSchema,
) {
  const json = await request.json();
  return decodeWithLogging(schema, json);
}

export function decodeQuery<TSchema extends DecodableSchema>(
  request: Request,
  schema: TSchema,
) {
  const url = new URL(request.url);
  const query = qs.parse(url.search, { ignoreQueryPrefix: true });
  return decodeWithLogging(schema, query);
}
