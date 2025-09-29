import { useUserStore } from "~/stores/useUserStore.js";
import { useSocketIoStore } from "~/stores/useSocketIoStore.js";

// Asumimos que existe un userFileService migrado a un composable
// import { useUserFileService } from './useUserFileService';

export const useAuth = () => {
  const { $api } = useNuxtApp();
  const userStore = useUserStore();
  const socketIoStore = useSocketIoStore();
  const countdownLogic = useCountdown(); // Para iniciar/detener timers
  const { setItem, getItem, removeItem, getParsedJSON } = useLocalStorage();
  const appStore = useAppStore();
  const countdownStore = useCountdownStore();

  // const userFileService = useUserFileService();
  const { clearTimers: clearExpCheckTimers } = useTokenExpiryWatcher(logout);

  const isUserLoggedIn = () => {
    const token = getItem("token-user");
    const loggedIn = !!token;
    console.log("useAuth: isUserLoggedIn =", loggedIn);
    return loggedIn;
  };

  const getUserData = () => {
    const data = userStore.userData || getParsedJSON("userData");
    console.log("useAuth: getUserData =", data);
    return data;
  };

  const checkUser2FA = (userObject) => {
    if (!userObject) {
      console.log("useAuth: checkUser2FA = false (no userObject)");
      return false;
    }
    const result =
      !!userObject.is2FAEnabled &&
      userObject.type2FA !== "NONE" &&
      !userObject.was2FASucceedValidate;
    console.log("useAuth: checkUser2FA =", result);
    return result;
  };

  const validateTokenRefreshData = async ({
    login = false,
    checkTimeFlag = true,
  } = {}) => {
    console.log("useAuth: validateTokenRefreshData called", {
      login,
      checkTimeFlag,
    });

    if (login) {
      setItem("timeElapsed", "0");
      console.log("useAuth: login=true, timeElapsed set to 0");
      return;
    }

    const userToken = getItem("token-user");
    if (!userToken) {
      console.log("useAuth: No token-user found, skipping validation");
      return;
    }

    try {
      const timestamp = new Date().getTime();
      const { data: responseData } = await $api(`/tokenCheck`, {
        method: "GET",
        params: { timestamp },
      });

      if (responseData) {
        console.log("useAuth: tokenCheck successful", responseData);
        userStore.setUser(responseData.user);
        userStore.setRestrictedProducts(responseData.restrictedProducts);
        setItem("token", responseData.whitelabelAuthToken);
        setItem("timeElapsed", responseData.secondsElapsed);

        if (checkUser2FA(responseData.user)) {
          userStore.setVerificationInfo(responseData.user.type2FA, true);
        }

        if (checkTimeFlag) {
          console.log("useAuth: Running countdownLogic.checkTime()");
          await countdownLogic.checkTime();
        }

        await socketIoStore.connectToServer();
        await socketIoStore.subscribeToUserChannel();
      }
    } catch (err) {
      console.error("useAuth: Error in validateTokenRefreshData", err);
      if (err.response?.status === 401 || err.data?.statusCode === 401) {
        console.warn("useAuth: Token refresh unauthorized, logging out");
        await logout({ message: "Token refresh failed - Unauthorized" });
        clearExpCheckTimers();
      }
    }
  };

  const logout = async ({ message, optionalText = null }) => {
    console.log("useAuth: logout called with", { message, optionalText });
    appStore.setOptionalTextInformation(optionalText);

    try {
      await $api("/auth/logout", {
        method: "POST",
        body: { action: message },
      });
      console.log("useAuth: logout API call successful");
    } catch (error) {
      console.warn("useAuth: Logout API call failed", error);
    }

    await socketIoStore.disconnectFromServer();
    await socketIoStore.unsubscribeFromUserChannel();

    clearUserSession();
    countdownLogic.stopAllTimers();
    clearExpCheckTimers();

    const { hideAllNotifications, hideToastWarning } = useNotifications();
    hideToastWarning();
    hideAllNotifications();

    countdownStore.resetAllTimersState();

    const router = useRouter();
    if (router.currentRoute.value.path !== "/") {
      console.log("useAuth: Navigating to home after logout");
      await navigateTo(
        { path: "/", query: router.currentRoute.value.query },
        { replace: true }
      );
      appStore.openLoginModal();
    } else {
      appStore.openLoginModal();
    }
  };

  const clearUserSession = () => {
    console.log("useAuth: clearUserSession called");
    userStore.setUser(null);
    userStore.setRestrictedProducts([]);
    removeItem("userData");
    removeItem("token-user");
    removeItem("userName");
    removeItem("expiredPassword");
    removeItem("modalExpire");
    // removeItem("token"); //whitelabel token
    removeItem("restructed");
    removeItem("timeElapsed");
    removeItem("time");
    removeItem("currency");
  };

  const updateAutoExcludeOptions = async (options) => {
    console.log("useAuth: updateAutoExcludeOptions called", options);
    if (!userStore.userId) {
      console.error(
        "useAuth: Cannot update auto-exclude, user is not logged in"
      );
      throw new Error("User not logged in to update auto-exclude options.");
    }
    return await $api(`/users/update-autoexclude`, {
      method: "POST",
      body: {
        options: options,
        id: userStore.userId,
      },
    });
  };

  return {
    isUserLoggedIn,
    getUserData,
    validateTokenRefreshData,
    clearUserSession,
    updateAutoExcludeOptions,
    checkUser2FA,
    logout,
  };
};
