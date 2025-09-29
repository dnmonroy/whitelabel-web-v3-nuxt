<template>
  <div>
    {{templateComponent}}
    <component :is="templateComponent" v-if="templateComponent" />
  </div>
</template>

<script setup>
const templateComponent = ref(null);
const { clearTimers: clearExpCheckTimers, init: initExpCheck } =
  useTokenExpiryWatcher();

onMounted(async () => {
  try {
    const { component, layoutName } = await useTemplate();
    // templateComponent.value = component;
    templateComponent.value = component;

    // definePageMeta({
    //   layout: layoutName,
    // });
  } catch (error) {
    console.error("Failed to load whitelabel data on mount:", error);
  }

  initExpCheck();
  useModalFromQuery();
});

onUnmounted(() => {
  clearExpCheckTimers();
});
</script>
