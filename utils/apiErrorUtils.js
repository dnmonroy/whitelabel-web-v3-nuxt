// utils/apiErrorUtils.ts
export function axiosErrorHandle(error) {
  // `error` puede ser de Axios o $fetch
  const { t } = useI18n(); // Se puede usar aquí si este utils se importa en un contexto de setup

  if (!error) return "Unknown error occurred";

  // Error de $fetch (FetchError)
  if (error.data && error.data.message) {
    // Estructura común de error de $fetch con datos
    if (Array.isArray(error.data.message)) {
      return error.data.message
        .map((item, index) => `${index + 1}- ${item}`)
        .join("\n");
    }
    return error.data.message;
  }

  // Error de Axios (si aún se usa en algún lado o para compatibilidad)
  if (error.response) {
    // The request was made and the server responded
    if (error.response.data && error.response.data.message) {
      if (Array.isArray(error.response.data.message)) {
        return error.response.data.message
          .map((item, index) => `${index + 1}- ${item}`)
          .join("\n");
      }
      return error.response.data.message;
    }
    return `Error ${error.response.status}: ${error.response.statusText}`;
  }

  if (error.request) {
    // The request was made but no response was received
    return t_isr(
      "not_establish_communication_server",
      "Could not establish communication with the server."
    );
  }

  // Something happened in setting up the request that triggered an Error OR other type of error
  if (error.message) {
    return error.message;
  }

  return t_isr("unknown_error", "An unexpected error occurred.");
}

// Helper para `t` que puede funcionar fuera de `setup` si es necesario, o si `useI18n` no está disponible.
// Sin embargo, es mejor usar `useI18n` donde sea posible.
// Para utilidades realmente aisladas, considera pasar `t` como argumento o el texto traducido.
function t_isr(key, fallback) {
  if (typeof useI18n === "function") {
    try {
      return useI18n().t(key);
    } catch (e) {
      // useI18n puede no estar disponible si esto se llama muy temprano o fuera de un contexto Nuxt adecuado
      return fallback;
    }
  }
  return fallback;
}
