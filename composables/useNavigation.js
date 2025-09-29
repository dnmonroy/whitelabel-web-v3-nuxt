// composables/useNavigation.ts
import { navigateTo, type } from "#app";

export const useNavigation = () => {
  const isExternalHref = (href) => {
    return href.startsWith("http:") || href.startsWith("https:");
  };

  const dynamicNavigate = (href, options) => {
    if (isExternalHref(href)) {
      if (process.client) {
        window.open(href, "_blank", "noopener noreferrer");
      }
    } else {
      return navigateTo(href, options);
    }
  };

  const getLinkProps = (link) => {
    const isExternal = isExternalHref(link.href);
    const inNewWindow = link.inNewWindows;
    const linkType = link.buttonType;

    if (isExternal || linkType === "link") {
      return {
        is: "a", // Para usar con <component :is="...">
        href: link.href,
        target: inNewWindow ? "_blank" : undefined,
        rel: inNewWindow ? "noopener noreferrer" : undefined,
      };
    }

    // Para NuxtLink, 'to' es la prop principal.
    // Si es un producto o lobby y se abre en nueva ventana, forzamos 'a' tag.
    let toValue = link.href;
    let hrefValue = undefined;
    let componentType = "NuxtLink"; // NuxtLink es el default para rutas internas
    let targetValue = undefined;
    let relValue = undefined;

    if ((linkType === "product" || linkType === "lobby") && inNewWindow) {
      hrefValue = link.href;
      if (linkType === "product" && hrefValue.includes("?")) {
        hrefValue += "&nw=true"; // Manteniendo la lógica original
      } else if (linkType === "product") {
        hrefValue += "?nw=true";
      }
      toValue = undefined; // No usar 'to' si es un 'a' tag
      componentType = "a";
      targetValue = "_blank";
      relValue = "noopener noreferrer";
    }

    return {
      is: componentType,
      to: toValue,
      href: hrefValue,
      target: targetValue,
      rel: relValue,
    };
  };

  return {
    dynamicNavigate,
    getLinkProps,
    isExternalHref,
  };
};
