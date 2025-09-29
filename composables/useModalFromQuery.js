// composables/useModalFromQuery.ts
import { computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAppStore } from "@/stores/useAppStore";

export function useModalFromQuery() {
  const route = useRoute();
  const router = useRouter();
  const appStore = useAppStore();

  // Observar el estado de los modales en el store de Pinia
  const isLoginModalOpen = computed(() => appStore.isLoginModalOpen);
  const isRegisterModalOpen = computed(() => appStore.isRegisterModalOpen);

  // Cuando el Query Param cambia, actualizamos el store
  const updateModalStateFromQuery = (modalParam) => {
    // Asegurarnos que modalParam es un string o null/undefined
    const currentModalParam = Array.isArray(modalParam)
      ? modalParam[0]
      : modalParam;

    if (currentModalParam === "login") {
      if (!appStore.isLoginModalOpen) {
        appStore.openLoginModal();
      }
    } else if (currentModalParam === "register") {
      if (!appStore.isRegisterModalOpen) {
        appStore.openRegisterModal();
      }
    } else {
      // Si el parámetro `modal` no es 'login' ni 'register', cerramos ambos
      if (appStore.isLoginModalOpen) {
        appStore.closeLoginModal();
      }
      if (appStore.isRegisterModalOpen) {
        // closeRegisterModal en el store ahora maneja la limpieza de query params si es necesario
        appStore.closeRegisterModal();
      }
    }
  };

  // Observar cambios en el query param 'modal'
  watch(
    () => route.query.modal,
    (newModalParam) => {
      // Solo procesar en el cliente, donde la URL y los modales son relevantes
      if (process.client) {
        updateModalStateFromQuery(newModalParam);
      }
    },
    { immediate: true } // Ejecutar inmediatamente al montar el composable
  );

  // Cuando el estado del store cambia, actualizamos la URL
  // Usamos un watcher combinado para simplificar
  watch(
    [isLoginModalOpen, isRegisterModalOpen],
    ([newLoginOpen, newRegisterOpen], [oldLoginOpen, oldRegisterOpen]) => {
      // Solo procesar en el cliente
      if (process.client) {
        const currentQuery = { ...route.query };
        let modalShouldBe = null;

        if (newLoginOpen) {
          modalShouldBe = "login";
        } else if (newRegisterOpen) {
          modalShouldBe = "register";
        }

        // Si el estado deseado del modal en la URL es diferente al actual, o si debe eliminarse
        if (currentQuery.modal !== modalShouldBe) {
          if (modalShouldBe) {
            router
              .replace({ query: { ...currentQuery, modal: modalShouldBe } })
              .catch(() => {});
          } else {
            // Si ningún modal debe estar abierto según el store, eliminamos el query param
            delete currentQuery.modal;
            // La acción closeRegisterModal del store ya maneja la eliminación de `affiliateCode`
            // así que no necesitamos replicar esa lógica aquí si el modal se cierra desde el store.
            // Sin embargo, si el query.modal se elimina por otra razón,
            // y el modal de registro estaba abierto, se cerrará por el watcher de arriba.
            router.replace({ query: currentQuery }).catch(() => {});
          }
        }
      }
    }
    // { immediate: true } // No es necesario immediate aquí, ya que el otro watch maneja el estado inicial desde la URL.
  );

  // El hook no necesita devolver nada si solo establece watchers.
  // Podrías devolver el estado de los modales si fuera útil para el componente que lo usa,
  // pero ya son accesibles a través de useAppStore().
  return {
    // Puedes exponer funciones o estado si es necesario
  };
}
