# Astro example

Static Astro site using `@rgglez/astro-i18n-gettext` from the parent
directory, with `es` and `fr` catalogs (English is the source language).

```bash
# in the repository root: the package exports dist/
bun install && bun run build

cd example
npm install
npm run dev
```

## Open locally

The site always uses the `/astro-i18n-gettext/` base path from
`astro.config.mjs`, the same one GitHub Pages uses, so add it to the URL:

| Command | URL |
| :------ | :-- |
| `npm run dev` | <http://localhost:4321/astro-i18n-gettext/> |
| `npm run build && npm run preview` | <http://localhost:4321/astro-i18n-gettext/> |

The base path redirects to the English page; open
<http://localhost:4321/astro-i18n-gettext/es/> or `.../fr/` directly for the
other languages. `http://localhost:4321/` without the path returns 404.

## What it shows

Each language has its own page (`en/`, `es/`, `fr/`), built from
`src/pages/[lang]/index.astro`. The `<select>`
re-translates the `<T>` elements on the client without reloading; the title
and the plurals are translated in the frontmatter and stay in the page's
language.

The `.po` files in `src/i18n/` are the sources; the `.json` catalogs next to
them are gettext-parser JSON (convert with
[gettext-po2json](https://github.com/rgglez/gettext-po2json)). Regenerate them
after editing a `.po` file.
