<script setup lang="ts">
import {useLocalApiPost} from "../composables/useApiFetch";

useHead({
  titleTemplate: () => {
    return 'My Card Vault'
  },
  link: [{ rel: 'icon', type: 'image/x-icon', href: '/media/favicon/favicon-16x16.png' }],
  meta: [
    { name: 'description', content: 'My Card Vault' }
  ]
});

const config = useRuntimeConfig();
const globalState = useGlobalState();
const isReady = ref(false);

onNuxtReady(async () => {
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
                }

                console.log('Asking for MemDB destruction...');
                useLocalApiPost('/gatekeeper/destroy')
                    .then(() => {
                      isReady.value = true
                    })
              })
        })
  })
})
</script>

<template>
  <div
      v-if="isReady"
      class="main-system"
      :class="[`theme-${globalState.theme}`]"
  >
    <!-- Header -->
    <app-header />
    <!-- /Header -->

    <!-- Body -->
    <app-body>
      <slot></slot>
    </app-body>
    <!-- /Body -->

    <!-- Footer -->
    <app-footer />
    <!-- /Footer -->

    <!-- Modals -->
    <app-modals-container />
    <!-- /Modals -->

    <link href="//cdn.jsdelivr.net/npm/keyrune@latest/css/keyrune.css" rel="stylesheet" type="text/css" />
  </div>
</template>