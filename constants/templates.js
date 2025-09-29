export const TEMPLATES = {
    APP: "app",
    APOSTALA: "apostala",
    KINGBOXPLUS: "kingboxplus",
    BIZERA: "bizera",
    GODMONEY: "godmoney",
    ZEUS: "zeus",
    GOLD: "gold",
    GANAMOS: "ganamos",
    NINE: "nine",
};

export const TEMPLATE_TYPES = {
    DYNAMIC_LAYOUT: "DYNAMIC_LAYOUT",
    STATIC: "STATIC",
};

export const TEMPLATE_MAP = {
    [TEMPLATES.APP]: {
        type: TEMPLATE_TYPES.STATIC,
        layoutName: "layout-app",
        component: () => import("@/components/templates/App/App.vue"),
    },
    [TEMPLATES.APOSTALA]: {
        type: TEMPLATE_TYPES.STATIC,
        layoutName: "layout-apostala",
        component: () => import("@/components/templates/Apostala/Apostala.vue"),
    },
    [TEMPLATES.KINGBOXPLUS]: {
        type: TEMPLATE_TYPES.STATIC,
        layoutName: "layout-kingboxplus",
        component: () => import("@/components/templates/Kingboxplus/Kingboxplus.vue"),
    },
    [TEMPLATES.BIZERA]: {
        type: TEMPLATE_TYPES.STATIC,
        layoutName: "layout-bizera",
        component: () => import("@/components/templates/Bizera/Bizera.vue"),
    },
    [TEMPLATES.GODMONEY]: {
        type: TEMPLATE_TYPES.STATIC,
        layoutName: "layout-godmoney",
        component: () => import("@/components/templates/Godmoney/Godmoney.vue"),
    },
    [TEMPLATES.ZEUS]: {
        type: TEMPLATE_TYPES.STATIC,
        layoutName: "layout-zeus",
        component: () => import("@/components/templates/Zeus/Zeus.vue"),
    },
    [TEMPLATES.GOLD]: {
        type: TEMPLATE_TYPES.DYNAMIC_LAYOUT,
        layoutName: "layout-gold",
        component: (layout) =>
            import(`@/components/templates/Gold/gold/${layout}.vue`),
    },
    [TEMPLATES.GANAMOS]: {
        type: TEMPLATE_TYPES.STATIC,
        layoutName: "layout-ganamos",
        component: () => import("@/components/templates/Ganamos/Ganamos.vue"),
    },
    [TEMPLATES.NINE]: {
        type: TEMPLATE_TYPES.STATIC,
        layoutName: "layout-nine",
        component: () => import("@/components/templates/Nine/Nine.vue"),
    },
};
