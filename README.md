# astro-i18n-gettext

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

[gettext](https://www.gnu.org/software/gettext/) translations for
[Astro](https://astro.build/): a per-request translator for frontmatter, a
`<T>` component, and client-side language switching without reloading.
Built on [@rgglez/i18n-gettext](https://github.com/rgglez/i18n-gettext), the
same core as [svelte-i18n-gettext](https://github.com/rgglez/svelte-i18n-gettext)
and [react-i18n-gettext](https://github.com/rgglez/react-i18n-gettext), so the
same `.json` catalogs work everywhere. Islands written in Svelte or React can
use those packages with the same catalogs.

## Install

```bash
npm install @rgglez/astro-i18n-gettext
```

## Usage

### 1. Register the catalogs

Create a module and import it from your layout, so it runs before any page
renders:

```ts
// src/i18n/index.ts
import { defineGettext } from "@rgglez/astro-i18n-gettext";
import es from "./es/messages.json";
import fr from "./fr/messages.json";

export const catalogs = { es, fr };
defineGettext({ catalogs, defaultLang: "en" });
```

### 2. Translate on the server

```astro
---
import "../i18n";
import { sprintf, useGettext } from "@rgglez/astro-i18n-gettext";
import T from "@rgglez/astro-i18n-gettext/T.astro";

const { _, _n } = useGettext(Astro);
---

<title>{_("Blog")}</title>
<p>{sprintf(_n("One post", "%d posts", count), count)}</p>
<h2><T msgid="Recent posts" /></h2>
<a href="/"><T msgid="Home" ctx="nav" /></a>
```

`useGettext(Astro)` picks the language from `Astro.currentLocale` (Astro's
i18n routing), then from a `[lang]` route parameter, then `defaultLang`.
It creates a translator per call, so concurrent server requests never share
a language. Static and server output both work.

`<T>` renders the translated text inside
`<span data-msgid data-msgctxt>`. The HTML already contains the translation;
the attributes only matter for client-side switching. `<T>` handles singular
strings; use `_n` in the frontmatter for plurals.

### 3. Switch language on the client (optional)

Astro components render once on the server. To change language without
navigating, re-translate the `<T>` elements from a client store:

```astro
<select id="lang">
  <option value="es">Español</option>
  <option value="fr">Français</option>
</select>

<script>
  import { bindGettext, createGettextStore } from "@rgglez/astro-i18n-gettext";
  import { catalogs } from "../i18n";

  const html = document.documentElement;
  const store = createGettextStore({ lang: html.lang, catalogs });
  bindGettext(document, store);
  document.querySelector("#lang")!.addEventListener("change", event => {
    html.lang = (event.target as HTMLSelectElement).value;
    store.setLang(html.lang);
  });
</script>
```

Only `<T>` elements (anything with `data-msgid`) change. Strings translated
in frontmatter with `_()` stay in the server-rendered language, and switching
on the client ships every imported catalog to the browser.

## API

| Export | Where | Description |
| :----- | :---- | :---------- |
| `defineGettext({ catalogs, defaultLang })` | server | Registers catalogs; returns `useGettext` |
| `useGettext(Astro)` | server | `{ _, _n, lang, hasTranslations }` for the request |
| `T.astro` | server | `<T msgid ctx?>` translated, tagged `<span>` |
| `createGettextStore`, `bindGettext(root, store)` | client | Live re-translation of `[data-msgid]` |
| `createTranslator`, `sprintf`, `vsprintf` | both | Re-exported from the core |

```ts
_(msgid, msgctxt = "app")
_n(msgid, msgidPlural = "", count = 0, msgctxt = "app")
```

## Catalogs

Catalogs are gettext `.po` files converted to gettext-parser JSON with
[gettext-po2json](https://github.com/rgglez/gettext-po2json) and the `app`
context. `xgettext` does not parse `.astro` files; extract from the
frontmatter and `<T msgid="...">` with
[gettext-extractor](https://github.com/rgglez/gettext-extractor) (regex
support), or keep translatable strings in `.ts` modules and use
`xgettext -L TypeScript --keyword=_ --keyword=_n:1,2`.

## Development

```bash
bun install
bun test src
bun run build
```

## License

Copyright (c) 2026 Rodolfo González González.

Licensed under the [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)
license. Read the [LICENSE](LICENSE) file.
