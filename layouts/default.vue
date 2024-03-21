<script setup lang="ts">
useHead({
  titleTemplate: () => {
    return 'My Card Vault'
  },
  link: [{ rel: 'icon', type: 'image/x-icon', href: '/media/favicon/favicon-16x16.png' }],
  meta: [
    { name: 'description', content: 'My Card Vault' }
  ]
});

import {Ref} from "preact/compat";
import {UnwrapRef} from "vue";

const config = useRuntimeConfig();
const globalState = useGlobalState();
</script>

<template>
  <div
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
  </div>
</template>