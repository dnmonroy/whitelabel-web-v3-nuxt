// composables/useCountdown.ts
import { useUserStore } from "@/stores/useUserStore";
import { useCountdownStore } from "@/stores/useCountdownStore";
import { useNotificationStore } from "@/stores/useNotificationStore";
import { useNotifications } from "@/composables/useNotifications";
import { useAuth } from "@/composables/useAuth";
import { useLocalStorage } from "@/stores/useBrowserStorage";
import { useI18n } from "vue-i18n";

// Usamos un objeto reactivo simple (ref) o un objeto plano para los IDs.
// No es necesario que sea un store de Pinia si solo se usa internamente en este composable.
const intervalRegistry = {
  checkTimePlayIntervalId: null,
  checkLimitSessionIntervalId: null,
  // setTimeOutTokenCheckId: null,
};

export const useCountdown = () => {
  const userStore = useUserStore();
  const countdownStore = useCountdownStore();
  const notificationStore = useNotificationStore();
  const notifications = useNotifications(); // Para notify y showSwalModal
  const { t } = useI18n(); // Para traducciones
  const { $moment } = useNuxtApp();

  const { getItem: getLocalStorageItem } = useLocalStorage();

  const getTimeElapsed = () => {
    try {
      // Asegurarse de que el valor es un string antes de parseInt, y proveer un fallback.
      return parseInt(getLocalStorageItem("timeElapsed") || "0", 10);
    } catch (e) {
      console.error("Error parsing timeElapsed from localStorage", e);
      return 0;
    }
  };

  // Función de utilidad para transformar tiempo, se puede mover a utils/timeUtils.ts si se usa en más sitios.
  const transformTime = (fromTo, value) => {
    if (isNaN(value)) return 0; // Salvaguarda por si value no es un número
    switch (fromTo) {
      case "ms-s":
        return value / 1000;
      case "m-ms":
        return value * 60 * 1000;
      case "ms-m":
        return value / 1000 / 60;
      case "s-ms":
        return value * 1000;
      default:
        return value;
    }
  };

  const checkTempExclusion = (userData, options) => {
    // Asegurar que las propiedades necesarias existen.
    if (
      !options?.temporalExclution?.duration ||
      !options?.temporalExclution?.endExclution ||
      !userData?.userSession?.currentLogin
    ) {
      console.warn(
        "Missing data for checkTempExclusion. UserData:",
        userData,
        "Options:",
        options
      );
      countdownStore.setAutoExclusionStatus(false); // Marcar como inactivo si faltan datos
      return;
    }

    const duration = options.temporalExclution.duration;
    const end = $moment(options.temporalExclution.endExclution);
    const currentDate = $moment(userData.userSession.currentLogin);

    const remaining = end.diff(currentDate, "milliseconds");

    countdownStore.setAutoExclusionDuration(duration); // Podría ser un string como "1 month" o un número
    countdownStore.setAutoExclusionRemaining(remaining > 0 ? remaining : 0);
  };

  const showAlertToast = (timeMs) => {
    const minutes = transformTime("ms-m", timeMs);
    const message = `${t("toast.play_alert_text_a")} ${minutes} ${t(
      "toast.play_alert_text_b"
    )}`;
    notifications.notify(t("game_time"), message, "warning", undefined, true);
  };

  const checkTimePlay = (options) => {
    if (!options?.alerts?.duration) {
      console.warn(
        "Missing alert duration in options for checkTimePlay",
        options
      );
      countdownStore.setAlertStatus(false);
      return;
    }

    const timeAlertMs = transformTime("m-ms", options.alerts.duration);
    let timeElapsedMs = transformTime("s-ms", getTimeElapsed());

    countdownStore.setAlertDuration(timeAlertMs); // Guardar la duración total de la alerta

    if (timeElapsedMs >= timeAlertMs) {
      showAlertToast(timeAlertMs);
      countdownStore.setAlertCountdown(0); // Ya pasó
      return;
    }

    // Limpiar intervalo existente antes de crear uno nuevo
    if (intervalRegistry.checkTimePlayIntervalId)
      clearInterval(intervalRegistry.checkTimePlayIntervalId);

    intervalRegistry.checkTimePlayIntervalId = setInterval(() => {
      // Siempre obtener el último valor de localStorage
      const currentLiveTimeElapsedSeconds = getTimeElapsed();
      if (isNaN(currentLiveTimeElapsedSeconds)) {
        console.warn(
          "timeElapsed from localStorage is NaN. Stopping checkTimePlay timer."
        );
        if (intervalRegistry.checkTimePlayIntervalId)
          clearInterval(intervalRegistry.checkTimePlayIntervalId);
        intervalRegistry.checkTimePlayIntervalId = null;
        countdownStore.setAlertStatus(false); // Marcar como inactivo
        return;
      }
      const currentLiveTimeElapsedMs = transformTime(
        "s-ms",
        currentLiveTimeElapsedSeconds
      );

      const countdownMs = timeAlertMs - currentLiveTimeElapsedMs;
      countdownStore.setAlertCountdown(countdownMs > 0 ? countdownMs : 0);

      if (currentLiveTimeElapsedMs >= timeAlertMs) {
        showAlertToast(timeAlertMs);
        if (intervalRegistry.checkTimePlayIntervalId)
          clearInterval(intervalRegistry.checkTimePlayIntervalId);
        intervalRegistry.checkTimePlayIntervalId = null;
        // No necesariamente se desactiva el status de la alerta aquí, solo el contador llegó a cero.
      }
    }, 1000);
  };

  const showLimitSessionToast = (timeMs) => {
    const seconds = transformTime("ms-s", timeMs);
    const content = `${t("toast.session_limit_text_a")} ${seconds} ${t(
      "toast.session_limit_text_b"
    )}`;

    notificationStore.setToastWarningContent(content);
    // La visualización del toast se haría mediante un componente que observe `notificationStore.toastWarningContent`
    // Ejemplo: <MyWarningToastComponent v-if="notificationStore.toastWarningContent" :content="notificationStore.toastWarningContent" />
  };

  const hideLimitSessionToast = () => {
    notificationStore.setToastWarningContent(null);
  };

  const doLimitSessionLogout = async () => {
    const auth = useAuth(); // Obtener instancia de useAuth aquí
    // El mensaje original era 'user logout to update self-exclusion'. Se cambia a uno más genérico.
    await auth.logout({
      message:
        t("toast.session_limit_logout_reason") ||
        "User logged out due to session limit",
    });
    // El showTimeLimitDialog original usaba swal.
    notifications.showSwalModal(
      t("session_limit"),
      t("toast.limit_exceeded"),
      "warning",
      false,
      false
    );
  };

  const checkLimitSession = (options) => {
    if (!options?.limitSession?.duration) {
      console.warn(
        "Missing limit session duration in options for checkLimitSession",
        options
      );
      countdownStore.setLimitSessionStatus(false);
      return;
    }
    const timeLimitMs = transformTime("m-ms", options.limitSession.duration);
    let timeElapsedMs = transformTime("s-ms", getTimeElapsed()); // Valor inicial

    countdownStore.setLimitSessionDuration(timeLimitMs); // Guardar la duración total del límite

    if (timeElapsedMs >= timeLimitMs) {
      doLimitSessionLogout();
      countdownStore.setLimitSessionCountdown(0); // Ya pasó
      return;
    }

    if (intervalRegistry.checkLimitSessionIntervalId)
      clearInterval(intervalRegistry.checkLimitSessionIntervalId);

    intervalRegistry.checkLimitSessionIntervalId = setInterval(() => {
      const currentLiveTimeElapsedSeconds = getTimeElapsed();
      if (isNaN(currentLiveTimeElapsedSeconds)) {
        console.warn(
          "timeElapsed from localStorage is NaN. Stopping checkLimitSession timer."
        );
        if (intervalRegistry.checkLimitSessionIntervalId)
          clearInterval(intervalRegistry.checkLimitSessionIntervalId);
        intervalRegistry.checkLimitSessionIntervalId = null;
        countdownStore.setLimitSessionStatus(false); // Marcar como inactivo
        return;
      }
      const currentLiveTimeElapsedMs = transformTime(
        "s-ms",
        currentLiveTimeElapsedSeconds
      );
      const countdownMs = timeLimitMs - currentLiveTimeElapsedMs;

      countdownStore.setLimitSessionCountdown(
        countdownMs > 0 ? countdownMs : 0
      );

      // Mostrar advertencia 30 segundos antes
      if (countdownMs < 30000 && countdownMs >= 0) {
        showLimitSessionToast(countdownMs);
      }

      if (countdownMs <= 0) {
        if (intervalRegistry.checkLimitSessionIntervalId)
          clearInterval(intervalRegistry.checkLimitSessionIntervalId);
        intervalRegistry.checkLimitSessionIntervalId = null;
        doLimitSessionLogout();
      }
    }, 1000);
  };

  const checkTime = async () => {
    // Asegurarse que se ejecuta solo en el cliente, ya que depende de localStorage y timers
    if (process.server) return;

    const userData = userStore.userData; // Obtener los datos más recientes del store

    if (!userData || !userData.autoExclude) {
      countdownStore.setAlertStatus(false);
      countdownStore.setLimitSessionStatus(false);
      countdownStore.setAutoExclusionStatus(false);
      stopAllTimersInternal(); // Detener timers si no hay datos
      return;
    }

    const autoExcludeOptions = userData.autoExclude;

    if (autoExcludeOptions.alerts?.status) {
      countdownStore.setAlertStatus(true);
      checkTimePlay(autoExcludeOptions); // options ya tiene `alerts.duration`
    } else {
      countdownStore.setAlertStatus(false);
      if (intervalRegistry.checkTimePlayIntervalId)
        clearInterval(intervalRegistry.checkTimePlayIntervalId);
      intervalRegistry.checkTimePlayIntervalId = null;
    }

    if (autoExcludeOptions.limitSession?.status) {
      countdownStore.setLimitSessionStatus(true);
      checkLimitSession(autoExcludeOptions); // options ya tiene `limitSession.duration`
    } else {
      countdownStore.setLimitSessionStatus(false);
      if (intervalRegistry.checkLimitSessionIntervalId)
        clearInterval(intervalRegistry.checkLimitSessionIntervalId);
      intervalRegistry.checkLimitSessionIntervalId = null;
    }

    if (autoExcludeOptions.temporalExclution?.status) {
      countdownStore.setAutoExclusionStatus(true);
      checkTempExclusion(userData, autoExcludeOptions);
    } else {
      countdownStore.setAutoExclusionStatus(false);
    }
  };

  // Función interna para detener todos los timers de este composable
  const stopAllTimersInternal = () => {
    if (intervalRegistry.checkTimePlayIntervalId) {
      clearInterval(intervalRegistry.checkTimePlayIntervalId);
      intervalRegistry.checkTimePlayIntervalId = null;
    }
    if (intervalRegistry.checkLimitSessionIntervalId) {
      clearInterval(intervalRegistry.checkLimitSessionIntervalId);
      intervalRegistry.checkLimitSessionIntervalId = null;
    }
    // if (intervalRegistry.setTimeOutTokenCheckId) clearTimeout(intervalRegistry.setTimeOutTokenCheckId);
    // intervalRegistry.setTimeOutTokenCheckId = null;
    hideLimitSessionToast(); // Ocultar el toast de advertencia si estaba visible
  };

  // Método expuesto para ser llamado desde fuera (e.g., al hacer logout)
  const stopAllTimers = () => {
    stopAllTimersInternal();
    // Adicionalmente, resetear el estado en Pinia si es apropiado
    countdownStore.resetAllTimersState(); // Asumiendo que existe esta acción en el store
  };

  // La lógica de `validateTokenSetTimeOut` no estaba completamente definida en el util.js original,
  // pero si necesitas implementarla, sería algo así:
  // const validateTokenSetTimeOut = () => {
  //   if (process.server || !userStore.isLoggedIn) return; // O la condición que uses
  //   const whiteLabelCurrent = useSessionStorage().getParsedJSON<any>("whiteLabel");
  //   if (!whiteLabelCurrent?.expiredSession) return;
  //   const expiredSessionMs = whiteLabelCurrent.expiredSession * 60000;
  //   if (intervalRegistry.setTimeOutTokenCheckId) clearTimeout(intervalRegistry.setTimeOutTokenCheckId);
  //   intervalRegistry.setTimeOutTokenCheckId = setTimeout(async () => {
  //     console.log("Renovacion de token programada (setTimeOutTokenCheckId)");
  //     const auth = useAuth();
  //     await auth.validateTokenRefreshData({ checkTimeFlag: false }); // O la lógica que necesites
  //   }, expiredSessionMs - 10000); // 10 segundos antes
  // };

  // Limpieza automática si el composable se usa dentro de un componente y este se desmonta.
  // Sin embargo, para un servicio global como este, la limpieza explícita (stopAllTimers) es más robusta.
  // onScopeDispose(() => {
  //   stopAllTimersInternal();
  // });

  return {
    checkTime, // Inicia/actualiza todos los chequeos basados en userData.autoExclude
    stopAllTimers, // Detiene todos los timers y limpia estados (expuesto)
    // transformTime, // Exponer si se necesita fuera
    // validateTokenSetTimeOut, // Exponer si se implementa y usa
  };
};
