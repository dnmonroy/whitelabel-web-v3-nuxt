// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "url";
import VueI18nVitePlugin from "@intlify/unplugin-vue-i18n/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  modules: ["@pinia/nuxt", "@bootstrap-vue-next/nuxt"],
  bootstrapVueNext: {
    composables: true, // Will include all composables
    directives: { all: true }, // Will include all directives
  },
  css: ["bootstrap/dist/css/bootstrap.min.css"],
  runtimeConfig: {
    apiSecretKey: process.env.API_SECRET_KEY,
    googleTranslateApiKey: process.env.NUXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY,
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
    },
  },
  plugins: ["~/plugins/axios.js"],
  // build: {
  //   transpile: ['vue-i18n']
  // },
  // vite: {
  //   plugins: [
  //     VueI18nVitePlugin({
  //       include: [
  //         resolve(dirname(fileURLToPath(import.meta.url)), './locales/*.json')
  //       ]
  //     })
  //   ]
  // }
  // i18n: { // Ejemplo de configuración de i18n
  //   locales: [
  //     { code: 'en', iso: 'en-US', file: 'en.json', name: 'English' },
  //     { code: 'es', iso: 'es-ES', file: 'es.json', name: 'Español' },
  //   ],
  //   lazy: true,
  //   langDir: 'locales',
  //   defaultLocale: 'en',
  //   strategy: 'no_prefix', // O la estrategia que prefieras
  //   vueI18n: './i18n.config.ts', // Si tienes configuración avanzada de vue-i18n
  // },

  // Si necesitas cargar bvToast o swalAlert globalmente como plugins
  // css: ['bootstrap-vue-next/dist/bootstrap-vue-next.css'],
});
