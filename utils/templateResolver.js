import { useAppStore } from "~/stores/useAppStore.js";

export async function resolveTemplate(templateMap, componentType) {
  const appStore = useAppStore();
  let templateName = appStore.templateName; // Asumiendo que templateName está en appStore

  if (templateName === "default") templateName = "app"; // Lógica original

  const templateKey = `${templateName}${componentType}`; // ej: "appHeader", "customThemeFooter"
  const templatePath = templateMap[templateKey];

  if (!templatePath) {
    console.error(
      `Template for key "${templateKey}" (templateName: ${templateName}, componentType: ${componentType}) not found in templateMap.`
    );
    // Podrías devolver un componente de fallback o lanzar un error más específico.
    // throw new Error(`Template ${templateKey} not found`);
    return null; // O un componente de fallback
  }

  try {
    // La ruta para la importación dinámica debe ser relativa a una carpeta conocida
    // o usar un alias. Si `templatePath` es algo como "/templates/Header.vue",
    // y tus plantillas están en `components/templates/Header.vue`, entonces:
    // const component = await import(`@/components${templatePath}`);
    // Si templatePath es ya la ruta completa desde `components/`, ej: `templates/themes/MyHeader.vue`
    // const component = await import(`~/components/${templatePath}`); Asegúrate que el path es correcto.
    // La lógica original era `../../components/modules/templates${templatePath.slice(1)}`
    // Asumamos que `templatePath` es como "/MyTemplate.vue" y está en `~/components/modules/templates/MyTemplate.vue`

    const component = await import(
      `~/components/modules/templates${templatePath}`
    );
    // Nuxt 3 auto-importa `defineAsyncComponent` para los imports dinámicos,
    // y el resultado de `import()` ya es lo que necesitas.
    return component.default || component;
  } catch (error) {
    console.error(
      `Failed to load component for template key "${templateKey}" from path "${templatePath}":`,
      error
    );
    return null; // O un componente de fallback
  }
}
