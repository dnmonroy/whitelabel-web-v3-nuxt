export function useGoogleTranslate() {
  async function translateText(text, lang) {
    const { data, error } = await useFetch("/api/translate", {
      method: "POST",
      body: { text, lang },
    });
    
    if (error.value || data.value?.error) {
      console.warn("Error translating:", error.value || data.value?.error);
      return text;
    }

    return data.value?.translation ?? text;
  }

  return { translateText };
}
