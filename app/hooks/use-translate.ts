import { useCallback } from "react";
import type { Translatable } from "~/translations";
import { useLocale } from "./use-locale";

export function useTranslate() {
  const locale = useLocale();
  return useCallback(
    (translatable: Translatable) => translatable[locale],
    [locale],
  );
}
