// export default defineNuxtPlugin((nuxtApp) => {
//   const config = useRuntimeConfig();
//
//   const api = $fetch.create({
//     baseURL: config.public.apiBase,
//     onRequest({ options }) {
//       const token = localStorage.getItem("token-user");
//       if (token) {
//         options.headers = new Headers(options.headers || {});
//         options.headers.set("Authorization", `Bearer ${token}`);
//       }
//     },
//     onResponseError({ response, error }) {
//       console.error("[plugin:$api] error", response?.status, error);
//       if (response?.status === 401) {
//         // manejar redirección o logout
//       }
//     },
//   });
//
//   return {
//     provide: {
//       api, // Lo usarás como `useNuxtApp().$api`
//     },
//   };
// });
