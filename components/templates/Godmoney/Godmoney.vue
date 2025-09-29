<template>
  <main v-if="godmoneyTemplate" id="godmoney-template-layout">
    <div class="bg-image" :class="{ 'is-bg-image-in-home': isHome }">
      <GodMoneyHeader
        v-if="godmoneyTemplate.header"
        :header="godmoneyTemplate.header"
        :menu="godmoneyTemplate.menu"
      />
      <!-- El contenido de la página se inserta aquí -->
      <slot />
    </div>

    <GodMoneyFooter
      v-if="godmoneyTemplate.footer"
      :footer="godmoneyTemplate.footer"
    />

    <GodMoneyResponsibleGaming />

    <DropdownContact
      v-if="godmoneyTemplate.header"
      :button-color="godmoneyTemplate.header.background_color"
      :icon-color="godmoneyTemplate.header.color"
    />

    <!-- Si Tawk.to se maneja con un componente y estado global -->
    <TawkToChatWidget
      v-if="appStore.showChatTawk && appStore.urlChatTawk"
      :src="appStore.urlChatTawk"
    />
  </main>
  <div v-else>
    <!-- Mostrar un loader o mensaje mientras se carga la configuración de la plantilla -->
    Loading Godmoney Template...
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch, useNuxtApp } from "#imports";
import { useRoute } from "vue-router";
import { useAppStore } from "@/stores/useAppStore";
import { useUserStore } from "@/stores/useUserStore";
import { createCssVar } from "@/utils/domUtils";
import GodMoneyResponsibleGaming from "@/components/templates/Godmoney/sections/GodMoneyResponsibleGaming.vue"

definePageMeta({
  layout: "layout-godmoney",
});

const appStore = useAppStore();
const userStore = useUserStore();
const route = useRoute();
const { $vuetify } = useNuxtApp();

const godmoneyTemplate = computed(() => appStore.template);
const isHome = computed(() => route.path === "/");

const setVuetifyDarkTheme = (isDark: boolean) => {
  if ($vuetify && $vuetify.theme) {
    $vuetify.theme.global.name.value = isDark ? "dark" : "light";
  }
};

const applyChatSettings = () => {
  if (godmoneyTemplate.value?.contact) {
    appStore.setShowChatTawk(!!godmoneyTemplate.value.contact.allowTawk);
    appStore.setUrlChatTawk(godmoneyTemplate.value.contact.urlTawk || null);
  }
};

const applyCssVars = () => {
  //Only in the client and if there is config
  if (!godmoneyTemplate.value || process.server) return;

  createCssVar(document.body, {
    "--primary-color": godmoneyTemplate.value.main.colors.primaryColor,
    "--header-bg": godmoneyTemplate.value.header.background_color,
    "--header-c": godmoneyTemplate.value.header.color,
    "--body-font": godmoneyTemplate.value.main.font,
    "--body-color": godmoneyTemplate.value.main.colors.bodyColor,
    "--background-image": godmoneyTemplate.value.main.backgroundImage
      ? `url(${godmoneyTemplate.value.main.backgroundImage})`
      : "none",
    "--background-color": godmoneyTemplate.value.main.colors.backgroundColor,
    "--placeholder-color": godmoneyTemplate.value.main.colors.placeHolderColor,
    "--secondary-color": godmoneyTemplate.value.main.colors.secondaryColor,
    "--secondary-alt-color":
      godmoneyTemplate.value.main.colors.secondaryAltColor,
    "--para-color": godmoneyTemplate.value.main.colors.paraColor,
    "--para-alt-color": godmoneyTemplate.value.main.colors.paraAltColor,
    "--section-color": godmoneyTemplate.value.main.colors.sectionColor,
    "--bs-white": godmoneyTemplate.value.main.colors.bsWhite,
    "--text-color": godmoneyTemplate.value.main.colors.textColor,
    "--setting-bg-primary":
      godmoneyTemplate.value.user_profile.colors.bgPrimary,
    "--setting-bg-secondary":
      godmoneyTemplate.value.user_profile.colors.bgSecondary,
    "--setting-border": godmoneyTemplate.value.user_profile.colors.colorBorder,
    "--setting-color-primary":
      godmoneyTemplate.value.user_profile.colors.colorPrimary,
    "--setting-color-primary-text":
      godmoneyTemplate.value.user_profile.colors.colorPrimaryText,
    "--setting-color-secondary":
      godmoneyTemplate.value.user_profile.colors.colorSecondary,
  });
};

const updateWalletData = async () => {
  // await userStore.updateWallet(); // Ejemplo si es una acción que hace la llamada
  console.log(
    "updateWalletData called - implement actual API call or store action."
  );
};

watch(
  godmoneyTemplate,
  (newConfig) => {
    if (newConfig && process.client) {
      applyCssVars();
      applyChatSettings();
    }
  },
  { deep: true, immediate: true }
);

onMounted(async () => {
  setVuetifyDarkTheme(false);
  await updateWalletData();
});
</script>

<!-- Los estilos globales se pueden mantener aquí o mover -->
<style lang="scss">
// Si `assets/styles.scss` contiene variables globales o mixins necesarios para este layout
// @import "@/assets/styles/main.scss"; // Ajusta la ruta a tu archivo principal de estilos

// Estilos específicos del layout que usan las CSS vars
html {
  scroll-behavior: smooth;
}

.bg-image {
  // background-color: transparent; // Puede ser manejado por --background-color si es necesario
  background-image: none; // Por defecto

  &.is-bg-image-in-home {
    background-image: var(--background-image); // Aplicado por JS
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
  }
}

#godmoney-template-layout {
  // Cambiado el ID para evitar colisiones con Vue 2 si coexisten temporalmente
  font-family: var(--body-font);
  background-color: var(--body-color); // CSS Var
  font-size: 16px;
  line-height: 30px;
  margin: 0;
  font-weight: 400;
  overflow-x: hidden;
  letter-spacing: 0 !important; // Considera si !important es realmente necesario
}

.form-control {
  // Estas clases parecen ser de Bootstrap u otra lib CSS
  background-color: color-mix(
    in srgb,
    var(--primary-color) 15%,
    transparent 100%
  ) !important;
  color: var(--text-color) !important;
  border: none;

  &-input {
    // Asumiendo que es una clase hija o modificadora
    &:after {
      // Esto parece específico de alguna implementación de input
      background-color: var(--primary-color) !important;
      color: var(--text-color) !important;
    }
  }

  option {
    background-color: var(
      --primary-color
    ) !important; // Estilar options es limitado
  }
}

.modal-content {
  // Clase de Bootstrap para modales
  background-color: var(--background-color); // CSS Var
  color: var(--text-color); // CSS Var
}
</style>
