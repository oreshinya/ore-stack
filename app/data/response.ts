import { data } from "react-router";

export function res404() {
  return new Response(null, { status: 404 });
}

export function data400(message: string) {
  return data({ message }, { status: 400 });
}
