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

  const obj: Record<string, FormDataEntryValue | Array<FormDataEntryValue>> =
    {};
  for (const [key, value] of formData.entries()) {
    const existing = obj[key];
    if (existing != null) {
      if (Array.isArray(existing)) {
        existing.push(value);
      } else {
        obj[key] = [existing, value];
      }
    } else {
      obj[key] = value;
    }
  }

  const form = qs.parse(obj as Record<string, string>);

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
