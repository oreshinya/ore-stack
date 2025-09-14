import { data } from "react-router";

export function throw404() {
  throw new Response(null, { status: 404 });
}

export function data400(message: string) {
  return data({ message }, { status: 400 });
}
