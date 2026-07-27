import { getClientLocales } from "remix-utils/locales/server";
import { localeContext } from "~/router-contexts/locale";
import { SUPPORTED_LOCALES } from "~/translations";
import type { Route } from "./+types/root";

const localeMiddleware: Route.MiddlewareFunction = ({ request, context }) => {
  const clientLocales = getClientLocales(request) ?? [];

  for (const clientLocale of clientLocales) {
    const language = clientLocale.split("-")[0];
    const locale = SUPPORTED_LOCALES.find(
      (supportedLocale) =>
        supportedLocale === clientLocale || supportedLocale === language,
    );
    if (locale) {
      context.set(localeContext, locale);
      return;
    }
  }
};

export const middleware: Array<Route.MiddlewareFunction> = [localeMiddleware];
