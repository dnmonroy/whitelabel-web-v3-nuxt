// stores/useCountdownStore.ts
import { defineStore } from "pinia";

export const useCountdownStore = defineStore("countdown", {
  state: () => ({
    alert: {
      status: false,
      duration: 0,
      countdown: 0,
    },
    limitSession: {
      status: false,
      duration: 0,
      countdown: 0,
    },
    autoExclusion: {
      status: false,
      duration: 0,
      remaining: 0,
    },
  }),
  actions: {
    // Alert Actions
    setAlertStatus(status) {
      this.alert.status = status;
    },
    setAlertDuration(duration) {
      // Asumiendo que es ms
      this.alert.duration = duration;
    },
    setAlertCountdown(countdown) {
      // ms
      this.alert.countdown = countdown;
    },

    // Limit Session Actions
    setLimitSessionStatus(status) {
      this.limitSession.status = status;
    },
    setLimitSessionDuration(duration) {
      // ms
      this.limitSession.duration = duration;
    },
    setLimitSessionCountdown(countdown) {
      // ms
      this.limitSession.countdown = countdown;
    },

    // Auto Exclusion Actions
    setAutoExclusionStatus(status) {
      this.autoExclusion.status = status;
    },
    setAutoExclusionDuration(duration) {
      this.autoExclusion.duration = duration;
    },
    setAutoExclusionRemaining(remaining) {
      // ms
      this.autoExclusion.remaining = remaining;
    },

    resetAllTimersState() {
      this.alert = { status: false, duration: 0, countdown: 0 };
      this.limitSession = { status: false, duration: 0, countdown: 0 };
      this.autoExclusion = { status: false, duration: 0, remaining: 0 };
    },
  },
});
