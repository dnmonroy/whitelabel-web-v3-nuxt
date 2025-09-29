// composables/useTranslation.ts
// import { gTranslate } from '@/plugins/google-translate'; // O donde esté gTranslate

// Placeholder para gTranslate - ¡DEBES ADAPTAR ESTO!
async function gTranslate(text, targetLocale) {
  console.warn(
    `[Mock gTranslate] Called for: "${text}" to locale "${targetLocale}". Returning original text.`
  );
  // Aquí iría la lógica real de gTranslate.
  // Si es una llamada API, usa $fetch.
  // Ejemplo:
  // const { $gtranslateApi } = useNuxtApp(); // Si lo provees vía plugin
  // return await $gtranslateApi.translate(text, targetLocale);
  return Promise.resolve(text);
}

export const useTranslation = async () => {
  const { locale } = useI18n(); // Obtiene el locale actual de Nuxt i18n

  const translatableText = async (
    text,
    autoErrorHandle = true,
    canBeTooLong = false
  ) => {
    if (!text) return "";

    const currentLocale = locale.value; // ej: 'en', 'es'

    if (canBeTooLong && text.length > 4900) {
      const fragments = [];
      for (let i = 0; i < text.length / 4900; i++) {
        const start = i * 4900;
        const end = start + 4900;
        const fragment = text.slice(start, end);
        // Llamada recursiva, pero ahora pasa el locale actual
        fragments.push(
          await _internalTranslate(fragment, currentLocale, autoErrorHandle)
        );
      }
      return fragments.join("");
    }
    return _internalTranslate(text, currentLocale, autoErrorHandle);
  };

  // Función interna para evitar repetición y manejar la llamada a gTranslate
  const _internalTranslate = async (
    text,
    string,
    targetLocale,
    autoErrorHandle,
    boolean
  ) => {
    if (autoErrorHandle) {
      try {
        return await gTranslate(text, targetLocale);
      } catch (e) {
        console.error("gTranslate error:", e);
        return text; // Devuelve el texto original en caso de error
      }
    } else {
      return await gTranslate(text, targetLocale);
    }
  };
  return {
    translatableText,
  };
};
