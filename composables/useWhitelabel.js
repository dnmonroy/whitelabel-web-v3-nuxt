export const useWhitelabel = () => {
  const { $api } = useNuxtApp();
  const appStore = useAppStore();
  const { notify } = useNotifications();
  const config = useRuntimeConfig();
  const localStorage = useLocalStorage();
  const sessionStorage = useSessionStorage();

  const getWhiteLabelDataFromSession = () => {
    const data = sessionStorage.getJSON("whiteLabel");
    console.log("useWhitelabel: getWhiteLabelDataFromSession =", data);
    return data;
  };

  const loadWhiteLabel = async () => {
    console.log("useWhitelabel: loadWhiteLabel called");

    try {
      const timestamp = Date.now();
      const { data } = await $api(`/getWhitelabel`, {
        method: "GET",
        params: { timestamp },
      });

      if (data) {
        console.log("useWhitelabel: Whitelabel data loaded", data);
        localStorage.setJSON("token", data.token);
        sessionStorage.setJSON("whiteLabel", data);
        appStore.setPageData(data);
        updateFavicon(appStore.template?.favicon)
        return data;
      } else {
        console.warn("useWhitelabel: No data returned from /getWhitelabel");
      }
    } catch (e) {
      console.error("useWhitelabel: Error loading whitelabel data", e);
      const { axiosErrorHandle } = await import("@/utils/apiErrorUtils");

      if (e.response?.status === 403 || e.data?.statusCode === 403) {
        console.warn("useWhitelabel: 403 detected, redirecting to /maintenance");
        navigateTo("/maintenance");
      } else {
        const errorMessage = axiosErrorHandle(e);
        notify("App Error", errorMessage, "danger", 5000);
      }
      throw e;
    }
  };

  const getCurrentWhitelabelHost = () => {
    console.log("useWhitelabel: getCurrentWhitelabelHost called");

    if (process.server) {
      console.warn("useWhitelabel: getCurrentWhitelabelHost called on server");
      return config.public.apiBase;
    }

    const whitelabelData = getWhiteLabelDataFromSession();
    const currentOrigin = window.location.origin;

    if (whitelabelData?.host && Array.isArray(whitelabelData.host)) {
      const matchingHost = whitelabelData.host.find(
          (hostUrl) => hostUrl === currentOrigin
      );
      const resultHost = matchingHost || whitelabelData.host[0] || currentOrigin;
      console.log("useWhitelabel: resolved host =", resultHost);
      return resultHost;
    }

    console.log("useWhitelabel: using currentOrigin as fallback =", currentOrigin);
    return currentOrigin;
  };

  return {
    loadWhiteLabel,
    getCurrentWhitelabelHost,
    getWhiteLabelDataFromSession,
  };
};
