export const useApi = (url, options = {}) => {
  const config = useRuntimeConfig();
  const token = useLocalStorage().getItem("token-user"); // Asegúrate que esto no se ejecute en SSR

  const params = {
    baseURL: config.public.apiBase,
    ...options,
    onRequest({ request, options }) {
      if (token) {
        options.headers = new Headers(options.headers || {});
        options.headers.set("Authorization", `Bearer ${token}`);
      }
    },
    onRequestError({ error }) {
      console.error("[useApi] onRequestError", error);
    },
    onResponse({ response }) {
      // Puedes transformar datos si necesitas
    },
    onResponseError({ response, error }) {
      console.error("[useApi] onResponseError", error);
      if (response?.status === 401) {
        // manejar logout o redirección si aplica
      }
    },
  };

  return useFetch(url, params);
};
