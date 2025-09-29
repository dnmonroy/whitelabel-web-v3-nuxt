import { useI18n } from "vue-i18n";
import { jwtDecode } from "jwt-decode";

export function useTokenExpiryWatcher(logoutCallback) {
  // Timers used to trigger warning and logout
  let logoutTimer;
  let warningTimer;

  const localStorage = useLocalStorage();
  const { t } = useI18n(); // i18n composable
  const { notify } = useNotifications();

  /**
   * Initializes expiration check when a token exists in localStorage.
   * Sets up auto logout timers based on token's expiration time.
   */
  const init = () => {
    console.log("[🔐 Session] Initializing session expiration check...");
    const token = localStorage.getItem("token-user");
    if (token) {
      console.log("[🧪 Token] Found token, setting up auto logout...");
      setupAutoLogout(token);
    } else {
      console.log("[❌ Token] No token found, skipping auto logout setup.");
    }
  };

  /**
   * Clears both warning and logout timers.
   * Useful when logging out manually or when timers need to be reset.
   */
  const clearTimers = () => {
    console.log("[🧹 Timers] Clearing warning and logout timers...");
    if (warningTimer) clearTimeout(warningTimer);
    if (logoutTimer) clearTimeout(logoutTimer);
  };

  /**
   * Notifies the user that the session is about to expire.
   * Triggered 2 minutes before token expiration.
   */
  const showWarning = () => {
    console.log("[⚠️ Session] Showing expiration warning toast...");
    const msg =
      "Your session will expire in 2 minutes. Please save your changes.";
    notify(t("time"), msg, "warning", 2000, true);
  };

  /**
   * Decodes a JWT token and returns its expiration time in milliseconds.
   * If decoding fails, returns null.
   */
  const getTokenExpiration = (token) => {
    try {
      const decoded = jwtDecode(token);
      console.log("[🔍 Token] Decoded expiration time (exp):", decoded.exp);
      return decoded.exp * 1000; // Convert seconds to milliseconds
    } catch (error) {
      console.error("[❗ Token] Error decoding token:", error);
      return null;
    }
  };

  /**
   * Returns the remaining time (in milliseconds) until the token expires.
   * @param {number} expirationTime - Timestamp in ms
   */
  const getRemainingTime = (expirationTime) => {
    const now = new Date().getTime();
    const remaining = expirationTime - now;
    console.log(`[⏱️ Time] Remaining time until expiration: ${remaining}ms`);
    return remaining;
  };

  /**
   * Forces logout of the user when the session expires.
   * Displays a notification before logging out.
   */
  const forceLogout = async () => {
    console.log("[🔒 Session] Session expired. Triggering forced logout...");
    const msg = "Your session has expired. Please log in again.";
    notify(t("time"), msg, "warning", 2000, true);
    if (logoutCallback) await logoutCallback({ message: "session expired" });
  };

  /**
   * Sets up automatic warning and logout actions based on token expiration.
   * - Warns the user 2 minutes before the token expires.
   * - Logs out the user 1 minute before the actual expiration to prevent failures.
   */
  const setupAutoLogout = (token) => {
    console.log("[⚙️ Session] Setting up auto logout timers...");
    const expirationTime = getTokenExpiration(token);
    if (!expirationTime) {
      console.warn("[⛔ Token] Invalid expiration time. Aborting setup.");
      return;
    }

    const remainingTime = getRemainingTime(expirationTime);

    // If the token is already expired, logout immediately
    if (remainingTime <= 0) {
      console.warn(
        "[⌛ Token] Token already expired. Logging out immediately."
      );
      forceLogout().then(() => {
        clearTimers();
      });
      return;
    }

    const warningDelay = remainingTime - 120000; // 2 minutes before
    const logoutDelay = remainingTime - 60000; // 1 minute before

    console.log(
      `[⚠️ Warning Timer] Will show warning in ${warningDelay / 1000}s`
    );
    console.log(
      `[🔒 Logout Timer] Will trigger logout in ${logoutDelay / 1000}s`
    );

    // Show warning 2 minutes (120000 ms) before expiration
    warningTimer = setTimeout(showWarning, warningDelay);

    // Force logout 1 minute (60000 ms) before actual expiration
    logoutTimer = setTimeout(forceLogout, logoutDelay);
  };

  // Public API
  return {
    init,
    clearTimers,
  };
}
