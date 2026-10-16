import {
  createTranslator,
  type Catalogs,
  type GettextStore,
  type Translator,
} from "@rgglez/i18n-gettext";

export {
  createGettextStore,
  createTranslator,
  sprintf,
  vsprintf,
  type Catalog,
  type Catalogs,
  type GettextStore,
  type Translator,
} from "@rgglez/i18n-gettext";

interface Config {
  catalogs: Catalogs;
  defaultLang: string;
}

/** The parts of the `Astro` global used to find the request's language. */
export interface AstroLike {
  currentLocale?: string;
  params: Record<string, string | undefined>;
}

// Vite can load this module twice (externalized for the app, bundled for
// T.astro). A global symbol keeps one registry for both copies. It holds
// static configuration only; the language is resolved per request.
const KEY = Symbol.for("@rgglez/astro-i18n-gettext");
const registry = globalThis as typeof globalThis & { [KEY]?: Config };

/**
 * Register the catalogs once, from a module your layout imports. Returns
 * `useGettext` for convenience; it is also exported directly.
 */
export function defineGettext(config: Config) {
  registry[KEY] = config;
  return useGettext;
}

/**
 * Translator for the current request: `Astro.currentLocale` (Astro i18n
 * routing), then a `[lang]` route param, then `defaultLang`.
 */
export function useGettext(astro: AstroLike): Translator {
  const config = registry[KEY];
  if (!config) throw new Error("Call defineGettext() before useGettext().");
  return createTranslator(
    astro.currentLocale ?? astro.params.lang ?? config.defaultLang,
    config.catalogs
  );
}

type Translatable = {
  dataset: { msgid?: string; msgctxt?: string };
  textContent: string | null;
};

/**
 * Keep server-rendered `<T>` elements in sync with a client store. Every
 * `[data-msgid]` under `root` is re-translated whenever the language changes.
 * Returns the store's unsubscriber.
 */
export function bindGettext(
  root: { querySelectorAll(selector: string): Iterable<Translatable> },
  store: GettextStore
) {
  return store.subscribe(t => {
    for (const element of root.querySelectorAll("[data-msgid]")) {
      element.textContent = t._(element.dataset.msgid!, element.dataset.msgctxt);
    }
  });
}
