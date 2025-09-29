import { useToastController } from "bootstrap-vue-next";

export const useNotifications = () => {
  const { show, remove } = useToastController();
  const { translatableText } = useI18nTranslate();

  const notify = (title, msg, variant, timeMs, noAutoHide = false) => {
    show( {
      title,
      body: msg,
      value: true,
      autoHideDelay: noAutoHide ? 0 : timeMs,
      variant,
      solid: true,
      appendToast: true,
      noAutoHide,
      toastClass: [`custom-toast-${variant}`, "custom-toast"],
      headerClass: [`custom-toast-header-${variant}`, "custom-toast-header"],
      bodyClass: [`custom-toast-body-${variant}`, "custom-toast-body"],
    });
  };

  const translatableNotify = async (
    title,
    msg,
    variant,
    timeMs,
    noAutoHide = false
  ) => {
    try {
      const tMessage = await translatableText(msg, false);
      notify(title, tMessage, variant, timeMs, noAutoHide);
    } catch {
      notify(title, msg, variant, timeMs, noAutoHide);
    }
  };

  const showNotifyComponent = (id) => {
    show(id);
  };

  const hideNotifyComponent = (id) => {
    remove(id);
  };

  return {
    notify,
    translatableNotify,
    showNotifyComponent,
    hideNotifyComponent,
  };
};
