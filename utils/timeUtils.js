// utils/timeUtils.ts
export function transformTime(fromTo, value) {
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
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
