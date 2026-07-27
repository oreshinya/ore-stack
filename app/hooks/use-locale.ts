import { useRouteLoaderData } from "react-router";
import type { loader } from "~/root";
import { DEFAULT_LOCALE } from "~/translations";

export function useLocale() {
  const data = useRouteLoaderData<typeof loader>("root");
  return data?.locale ?? DEFAULT_LOCALE;
}
