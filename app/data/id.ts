import { ulid } from "ulidx";

export function generateId<Id extends string>() {
  return ulid() as Id;
}
