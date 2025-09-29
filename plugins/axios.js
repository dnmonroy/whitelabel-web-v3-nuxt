import axios from "axios";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const localStorage = useLocalStorage();

  const api = axios.create({
    baseURL: config.public.apiBase, // URL base desde las variables de entorno
  });

  // Configuración de los interceptores de Axios
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token-user");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      const response = error.response;
      console.error("[plugin:axios] error", response?.status, error);

      if (response?.status === 401) {
        // Aquí manejas el error 401 (No autorizado) - por ejemplo, redirigir o hacer logout
        // Puedes usar `useRouter().push("/login")` para redirigir a la página de login
      }

      return Promise.reject(error);
    }
  );

  // Proveer el api como `$api` para acceder en cualquier parte de la app
  nuxtApp.provide("api", api);
});
