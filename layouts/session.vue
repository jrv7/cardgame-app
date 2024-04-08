<script setup lang="ts">

useHead({
  titleTemplate: () => {
    return parsePageTitle.value
  },
  link: [{ rel: 'icon', type: 'image/x-icon', href: '/media/favicon/favicon-16x16.png' }],
  meta: [
    { name: 'description', content: 'MTG Game Session' }
  ]
});

const jQuery = import('jquery');
const SystemRef = ref(null);

const config = useRuntimeConfig();
const globalState = useGlobalState();
const isReady = ref(false);
const dragging = ref(false);
const dropContainers:{}[]|null = ref(null) as {}[]|null;

const parsePageTitle = computed(() => {
  return 'MTG Game Session';
});

const startDragging = (event) => {
  dragging.value = true;
  globalState.value.isDragging = true;
}

const finishDragging = (event) => {
  setTimeout(() => {
    dragging.value = false;
    globalState.value.isDragging = false;
  }, 2000)
}

const walkDrag = (event) => {
  if (dragging.value) {
    // console.log('Walking', event);
  }
}

onNuxtReady(async () => {
  await new Promise((resolve) => {
    isReady.value = true
    resolve(true);
  })
})
</script>

<template>
  <div
      v-if="isReady"
      ref="SystemRef"
      class="main-system page--game-session"
      @dragstart="(event) => startDragging(event)"
      @dragend="(event) => finishDragging(event)"
      @drag="(event) => walkDrag(event)"
  >
    <!-- Header -->
    <!-- app-header-deck-builder / -->
    <!-- /Header -->

    <!-- Body -->
    <app-body-deck-builder>
      <slot></slot>
    </app-body-deck-builder>
    <!-- /Body -->

    <!-- Modals -->
    <app-modals-container />
    <!-- /Modals -->

    <link href="//cdn.jsdelivr.net/npm/keyrune@latest/css/keyrune.css" rel="stylesheet" type="text/css" />
  </div>
</template>