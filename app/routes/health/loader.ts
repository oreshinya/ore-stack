import type { Route } from "./+types/_route";

export async function loader(_: Route.LoaderArgs) {
  return new Response("OK", { status: 200 });
}
