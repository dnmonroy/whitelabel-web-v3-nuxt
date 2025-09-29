import { defineStore } from "pinia";
import { useI18n } from "vue-i18n";

export const useAppStore = defineStore("app", {
  state: () => ({
    pageData: null,
    whitelabelName: null,
    template: null,
    templateName: "app",
    isLoginModalOpen: false,
    isRegisterModalOpen: false,
    showNavMenu: true,
    optionalTextInformation: null,
    showChatTawk: false,
    urlChatTawk: null,
    pageType: null,
    users: null,
  }),
  actions: {
    setPageData(pageContent) {
      this.pageData = pageContent;
      this.template = pageContent.page;
      this.pageType = pageContent.type;
      this.users = pageContent.users;
      this.banners = pageContent.banners;
      this.currencies = pageContent.currencies;
      this.whitelabelName = pageContent.name;

      // if (process.client) {
      //   const { getItem: getLocalItem } = useLocalStorage();
      //   const i18n = useI18n();
      //   if (!getLocalItem("lang") && pageContent.langDefault) {
      //     if (i18n.availableLocales.includes(pageContent.langDefault)) {
      //       i18n.setLocale(pageContent.langDefault);
      //     } else {
      //       console.warn(
      //         `Default language "${
      //           pageContent.langDefault
      //         }" is not available. Available: ${i18n.availableLocales.join(
      //           ", "
      //         )}`
      //       );
      //     }
      //   }
      // }
    },

    setShowChatTawk(show) {
      this.showChatTawk = show;
    },

    setUrlChatTawk(url) {
      this.urlChatTawk = url;
    },

    openLoginModal() {
      if (this.isLoginModalOpen) return;
      this.isRegisterModalOpen = false;
      this.isLoginModalOpen = true;
    },

    closeLoginModal() {
      this.isLoginModalOpen = false;
    },

    openRegisterModal() {
      if (this.isRegisterModalOpen) return;
      this.isLoginModalOpen = false;
      this.isRegisterModalOpen = true;
    },

    async closeRegisterModal() {
      // Acepta router si es necesario para query params
      const router = useRouter(); // Auto-importado
      const currentRoute = router.currentRoute.value;
      const q = { ...currentRoute.query };
      if (q.affiliateCode) {
        delete q.affiliateCode;
        try {
          // `navigateTo` es asíncrono y puede necesitar `await`
          // Usar `replace: true` para imitar `router.replace`
          await navigateTo({
            path: currentRoute.path,
            query: q,
            replace: true,
          });
        } catch (error) {
          console.warn("Failed to navigate on closeRegisterModal:", error);
        }
      }
      this.isRegisterModalOpen = false;
    },

    toggleNavMenu(show) {
      this.showNavMenu = show === undefined ? !this.showNavMenu : show;
    },

    setOptionalTextInformation(text) {
      this.optionalTextInformation = text;
    },
  },
});
