import { createI18n } from "vue-i18n";
import en from "../locales/en.json";
import es from "../locales/es.json";
import pt from "../locales/pt.json";

export default defineNuxtPlugin(({ vueApp }) => {
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: "en",
    messages: {
      en,
      es,
      pt,
    },
  });

  vueApp.use(i18n);
});
