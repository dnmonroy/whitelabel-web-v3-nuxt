import translatePkg from "@google-cloud/translate";
const { v2 } = translatePkg;
const { Translate } = v2;

const config = useRuntimeConfig();

const translate = new Translate({
  key: config.googleTranslateApiKey,
  maxRetries: 2,
});

const wordsExcluded = ["twitter"];

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { text, lang } = body;

    const words = text.match(/\S+|\s+/g) || [];
    let phrase = "";
    const result = [];

    for (const word of words) {
      if (wordsExcluded.includes(word.trim().toLowerCase())) {
        if (phrase.trim().length > 0) {
          const [translated] = await translate.translate(phrase.trim(), lang);
          result.push(translated);
          phrase = "";
        }
        result.push(word);
      } else {
        phrase += word;
      }
    }

    if (phrase.trim().length > 0) {
      const [translated] = await translate.translate(phrase.trim(), lang);
      result.push(translated);
    }

    return { translation: result.join("") };
  } catch (err) {
    console.error("Translation API error");
    setResponseStatus(event, 500);
    return { translation: null, error: "Translation failed." };
  }
});
