<script setup lang="ts">
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

const props = defineProps({
  icon: {
    type: [Object, Array, String],
    default: null
  },
  spin: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <ClientOnly>
    <font-awesome-icon class="icon fa-icon" :icon="props.icon" :spin="props.spin" />
  </ClientOnly>
</template>