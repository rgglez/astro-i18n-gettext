import { test } from "node:test";
import assert from "node:assert/strict";
import {
  bindGettext,
  createGettextStore,
  defineGettext,
  useGettext,
} from "./index";

const catalogs = {
  es: {
    translations: {
      app: { Hello: { msgid: "Hello", msgstr: ["Hola"] } },
      nav: { Home: { msgid: "Home", msgstr: ["Inicio"] } },
    },
  },
  fr: {
    translations: {
      app: { Hello: { msgid: "Hello", msgstr: ["Bonjour"] } },
      nav: { Home: { msgid: "Home", msgstr: ["Accueil"] } },
    },
  },
};

test("resolves the request language: currentLocale, [lang], default", () => {
  defineGettext({ catalogs, defaultLang: "fr" });
  assert.equal(useGettext({ currentLocale: "es-MX", params: {} })._("Hello"), "Hola");
  assert.equal(useGettext({ params: { lang: "es" } })._("Hello"), "Hola");
  assert.equal(useGettext({ params: {} })._("Hello"), "Bonjour");
});

test("bindGettext retranslates tagged elements on language changes", () => {
  const elements = [
    { dataset: { msgid: "Hello" }, textContent: "Hello" },
    { dataset: { msgid: "Home", msgctxt: "nav" }, textContent: "Home" },
  ];
  const store = createGettextStore({ lang: "es", catalogs });
  const stop = bindGettext({ querySelectorAll: () => elements }, store);
  assert.deepEqual(elements.map(e => e.textContent), ["Hola", "Inicio"]);
  store.setLang("fr");
  assert.deepEqual(elements.map(e => e.textContent), ["Bonjour", "Accueil"]);
  stop();
  store.setLang("es");
  assert.equal(elements[0].textContent, "Bonjour");
});
