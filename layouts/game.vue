<script setup lang="ts">
import {Deck} from "~/composables/entity/Deck";

useHead({
  titleTemplate: () => {
    return parsePageTitle.value
  },
  link: [{ rel: 'icon', type: 'image/x-icon', href: '/media/favicon/favicon-16x16.png' }],
  meta: [
    { name: 'description', content: 'MTG Game Session' }
  ]
});

const config = useRuntimeConfig();
const globalState = useGlobalState();
const isReady = ref(false);

const parsePageTitle = computed(() => {
  return 'MTG Game Session';
})

onNuxtReady(async () => {
  const route = useRoute();
  const deckId = route.params.deckId;

  await new Promise((resolve) => {
    const memoryDbSettingCookie = useCookie('memdb');
    if (typeof memoryDbSettingCookie.value === 'undefined') {
      memoryDbSettingCookie.value = true;
    }

    if (memoryDbSettingCookie.value !== globalState.value.useMemoryDatabases) {
      globalState.value.useMemoryDatabases = memoryDbSettingCookie.value;
    }

    useLocalApiPost('/settings', { setting: 'use-memory-databases', value: !!memoryDbSettingCookie.value })
        .then(() => {
          useDynamicPost('/scryfall/symbology')
              .then((response) => {
                if (response.data) {
                  globalState.value.mtgManaSymbolsCollection = response.data;
                  isReady.value = true
                }
              })
        })
  })
})
</script>

<template>
  <div
      v-if="isReady"
      class="main-system page--game-session"
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