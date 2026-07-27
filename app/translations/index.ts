import { en } from "./en";

type Translatables<T> = {
  [K in keyof T]: T[K] extends string
    ? Translatable
    : T[K] extends (params: infer P) => string
      ? (params: P) => Translatable
      : Translatables<T[K]>;
};

export type Translatable = Record<Locale, string>;

export type Translation = {
  [key: string]: Template | Translation;
};

type Template = string | ((params: never) => string);

export type Locale = keyof typeof translations;

const translations = { en } satisfies Record<string, typeof en>;

// Object.keys cannot keep Locale as the element type
export const SUPPORTED_LOCALES = Object.keys(
  translations,
) as ReadonlyArray<Locale>;
export const DEFAULT_LOCALE: Locale = "en";

// tsc cannot infer the tree's shape through the dynamic build
export const m = build(translations) as Translatables<typeof en>;

function build(translations: Record<Locale, Translation>) {
  const tree: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(translations[DEFAULT_LOCALE])) {
    // Every locale holds the same node type as the default locale's value
    // because the satisfies on translations enforces a single shape
    if (typeof value === "string") {
      const translatable = Object.fromEntries(
        SUPPORTED_LOCALES.map((locale) => {
          const v = translations[locale][key] as typeof value;
          return [locale, v];
        }),
      );

      tree[key] = translatable;
    } else if (typeof value === "function") {
      tree[key] = (params: never) => {
        const translatable = Object.fromEntries(
          SUPPORTED_LOCALES.map((locale) => {
            const v = translations[locale][key] as typeof value;
            return [locale, v(params)];
          }),
        );
        return translatable;
      };
    } else {
      // Object.fromEntries cannot keep Locale as the key type
      const subtrees = Object.fromEntries(
        SUPPORTED_LOCALES.map((locale) => {
          const v = translations[locale][key];
          return [locale, v];
        }),
      ) as Record<Locale, Translation>;

      tree[key] = build(subtrees);
    }
  }

  return tree;
}
