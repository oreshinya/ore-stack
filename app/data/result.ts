export type Result<T> =
  | { success: true; value: T }
  | { success: false; message: string };

export function success<T>(value: T) {
  return { success: true as const, value };
}

export function failure(message: string) {
  return { success: false as const, message };
}
