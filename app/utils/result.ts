export type Result<T> =
  | { success: true, val: T }
  | { success: false, message: string };

export function success<T>(val: T) {
  return { success: true as const, val };
}

export function failure(message: string) {
  return { success: false as const, message };
}
