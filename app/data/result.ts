import type { Translatable } from "~/translations";

export type Result<T> =
  | { success: true; value: T }
  | { success: false; message: Translatable };

export function success<T>(value: T) {
  return { success: true as const, value };
}

export function failure(message: Translatable) {
  return { success: false as const, message };
}
