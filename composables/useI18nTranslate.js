import { useI18n } from "vue-i18n";
import {useGoogleTranslate} from "~/composables/useGoogleTranslate.js";

export function useI18nTranslate() {
  const { locale } = useI18n();
  const { translateText } = useGoogleTranslate();

  async function translatableText(
    text,
    autoErrorHandle = true,
    canBeTooLong = false
  ) {
    if (!text) return "";

    if (canBeTooLong && text.length > 4900) {
      const chunks = [];
      for (let i = 0; i < text.length / 4900; i++) {
        const start = i * 4900;
        const end = start + 4900;
        const fragment = text.slice(start, end);
        chunks.push(await translatableText(fragment, autoErrorHandle));
      }
      return chunks.join("");
    }

    try {
      return await translateText(text, locale.value);
    } catch (err) {
      return autoErrorHandle ? text : Promise.reject(err);
    }
  }

  return { translatableText };
}
