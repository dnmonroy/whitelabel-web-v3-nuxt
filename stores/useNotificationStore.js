// stores/useNotificationStore.ts
import { defineStore } from "pinia";

export const useNotificationStore = defineStore("notification", {
  state: () => ({
    toastWarningContent: "",
    // Puedes añadir más estados para diferentes tipos de notificaciones si es necesario
  }),
  actions: {
    setToastWarningContent(content) {
      this.toastWarningContent = content;
    },
    // Ejemplo para mostrar/ocultar un componente de notificación específico
    // showComponent(componentName: string) { ... }
    // hideComponent(componentName: string) { ... }
  },
});
