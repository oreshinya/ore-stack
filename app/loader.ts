import { getLocale } from "~/router-contexts/locale";
import type { Route } from "./+types/root";

export function loader({ context }: Route.LoaderArgs) {
  return { locale: getLocale(context) };
}
