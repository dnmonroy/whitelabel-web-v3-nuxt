import { TEMPLATE_MAP, TEMPLATE_TYPES } from "@/constants/templates";

export const useTemplate = async () => {
  const { loadWhiteLabel } = useWhitelabel();
  const data = await loadWhiteLabel();

  if (!data || !data?.page?.type) {
    throw new Error("Template name is missing from whitelabel data");
  }

  const layout = data.layout || "default";
  // const type = data.page.type;
  const type = 'godmoney';

  const templateConfig = TEMPLATE_MAP[type];

  if (!templateConfig) {
    throw new Error(`Template "${type}" not found in map`);
  }

  const layoutName = templateConfig.layoutName || "layout-default";
  let component;

  try {
    if (templateConfig.type === TEMPLATE_TYPES.DYNAMIC_LAYOUT) {
      const module = await templateConfig.component(layout);
      component = module.default;
    } else {
      const module = await templateConfig.component();
      component = module.default;
    }
  } catch (err) {
    throw new Error(`Error loading component for ${type}: ${err}`);
  }

  return {
    component,
    layoutName,
  };
};
