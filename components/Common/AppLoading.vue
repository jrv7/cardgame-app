<script setup lang="ts">
const present = ref(true);
const visible = ref(true);
const close = async () => {
  return new Promise((resolve) => {
    visible.value = false;
    setTimeout(() => {
      present.value = false;
      resolve(true);
    }, 600)
  });
}

defineExpose({
  close
});
</script>

<template>
  <div
      v-if="present"
      class="app-loading"
      :class="{'visible': visible}"
  >
    <span><fa-icon :icon="['fas', 'spinner']" spin /></span>
    <span>{{ $_Tt('loading') }}...</span>
  </div>
</template>