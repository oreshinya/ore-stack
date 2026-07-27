import { useTranslate } from "~/hooks/use-translate";

export function useHook() {
  const t = useTranslate();
  return { t };
}
