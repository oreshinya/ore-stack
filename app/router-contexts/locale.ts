import { createContext, type RouterContextProvider } from "react-router";
import { DEFAULT_LOCALE, type Locale, type Translatable } from "~/translations";

export const localeContext = createContext<Locale>(DEFAULT_LOCALE);

export function getLocale(context: Readonly<RouterContextProvider>) {
  return context.get(localeContext);
}

export function t(
  context: Readonly<RouterContextProvider>,
  translatable: Translatable,
) {
  return translatable[getLocale(context)];
}
