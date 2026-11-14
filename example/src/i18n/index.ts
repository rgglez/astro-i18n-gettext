import { defineGettext } from "@rgglez/astro-i18n-gettext";
import es from "./es/messages.json";
import fr from "./fr/messages.json";

// English is the source language: no catalog, msgids are shown as-is.
export const catalogs = { es, fr };
defineGettext({ catalogs, defaultLang: "en" });
