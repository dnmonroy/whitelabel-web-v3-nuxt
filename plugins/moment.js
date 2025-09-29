import moment from "moment";
import "moment/locale/es";

export default defineNuxtPlugin(() => {
  moment.locale("es");

  return {
    provide: {
      moment,
    },
  };
});
