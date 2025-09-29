// stores/useUserStore.ts
import { defineStore } from "pinia";
import { useLocalStorage } from "~/stores/useBrowserStorage.js";

export const useUserStore = defineStore("user", {
  state: () => ({
    userData: null,
    // Para 'verification/SET_COMPONENT_TYPE' y 'verification/SET_VERIFICATION_MODAL'
    verification: {
      componentType: null,
      isVerificationModalOpen: false,
    },
    // Para 'restructed' que se guardaba en localStorage. Podría ser parte de userData o separado.
    restrictedProducts: [], // Define el tipo adecuado
    userDefaultCurrency: null,
    
  }),
  getters: {
    isLoggedIn: (state) => !!state.userData,
    
    userId: (state) => state.userData?._id || null,
    
    fullName: (state) => {
      if (!state.userData) return "";
      const firstName = state.userData.firstName || "";
      const lastName = state.userData.lastName || "";
      if (firstName && lastName) return `${firstName} ${lastName}`;
      return firstName || lastName || "";
    },
    
    needs2FAValidation: (state) => {
      if (!state.userData) return false;
      return !!(
        state.userData.is2FAEnabled &&
        state.userData.type2FA !== "NONE" &&
        !state.userData.was2FASucceedValidate
      );
    },
  },
  actions: {
    setUser(user) {
      this.userData = user;
      const { setJSON, removeItem } = useLocalStorage();
      if (user) {
        setJSON("userData", user);
      } else {
        removeItem("userData");
      }
    },
    
    setVerificationInfo(componentType, openModal) {
      this.verification.componentType = componentType;
      this.verification.isVerificationModalOpen = openModal;
    },
    
    setRestrictedProducts(products) {
      this.restrictedProducts = products;
      useLocalStorage().setJSON("restrictedProducts", products); // 'restructed' era el nombre anterior
    },
    
    // Acción para 'updateWallet', si era una llamada API, se moverá a un composable.
    // Si solo actualizaba estado, por ejemplo, el balance:
    // updateWalletBalance(newBalance: number) {
    //   if (this.userData) {
    //     this.userData.walletBalance = newBalance; // Asumiendo que existe walletBalance
    //   }
    // }

    // Simulación de la carga inicial desde localStorage (podría ir en un plugin Nuxt)
    loadUserFromStorage() {
      const { getParsedJSON } = useLocalStorage();
      const storedUser = getParsedJSON("userData");
      if (storedUser) {
        this.userData = storedUser;
      }
      const storedRestricted = getParsedJSON("restrictedProducts");
      if (storedRestricted) {
        this.restrictedProducts = storedRestricted;
      }
    },
  },
});
