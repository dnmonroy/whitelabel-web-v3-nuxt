/**
 * Creates or updates CSS custom properties (variables) on a given HTML element.
 * @param element The HTML element to set the CSS variables on (e.g., document.body).
 * @param variables An object where keys are variable names (e.g., "--primary-color")
 *                  and values are the CSS values (e.g., "#ff0000").
 */
export function createCssVar(element, variables) {
  if (!element || typeof element.style?.setProperty !== "function") {
    console.warn("createCssVar: Invalid element provided.");
    return;
  }

  for (const variableName in variables) {
    if (Object.prototype.hasOwnProperty.call(variables, variableName)) {
      const value = variables[variableName];
      if (value !== null && value !== undefined) {
        element.style.setProperty(variableName, String(value));
      } else {
        // Optionally remove the property if the value is null or undefined
        // element.style.removeProperty(variableName);
        // Or set to initial/empty
        element.style.setProperty(variableName, "");
      }
    }
  }
}

export const updateFavicon = (src) => {
  if (process.server || !src) return;

  let link = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.href = src;
};
