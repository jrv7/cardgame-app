<script setup lang="ts">
useHead({
  titleTemplate: () => {
    return 'Fiducial - SSO'
  },
  link: [{ rel: 'icon', type: 'image/x-icon', href: '/media/favicon/favicon-32x32.png' }],
  meta: [
    { name: 'description', content: 'Connection Portal' }
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
  </div>
</template>