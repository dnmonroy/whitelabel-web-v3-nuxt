<script setup lang="ts">
import { computed, useAppStore } from "#imports";

const appStore = useAppStore();
const godmoney_template = computed(() => appStore.template);

const rGamingStyle = () => {
  if (process.client) {
    return {
      backgroundColor:
        godmoney_template.value.responsible_gaming.background_color,
    };
  } else {
    return {};
  }
};
</script>

<template>
  <div
    class="responsible-gaming"
    :style="rGamingStyle"
    v-for="(item, index) in godmoney_template.responsible_gaming.images"
    :key="index"
    :src="item.src"
    alt="rg-image"
  >
    <div class="responsible-gaming__text">
      <!--      <g-translate-->
      <!--        :text="godmoney_template.responsible_gaming.title"-->
      <!--        :lang="$i18n.locale"-->
      <!--      />-->
      {{ godmoney_template.responsible_gaming.title }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.responsible-gaming {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  gap: 10px;

  img {
    width: 25px;
    height: auto;
  }

  &__text {
    font-size: 0.65rem;
    color: white;
    line-height: 20px;
  }
}
</style>
