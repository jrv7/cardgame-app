<script setup lang="ts">

import {SimpleButtonSizeType, SimpleButtonTypeType} from "~/composables/customTypes/SimpleButtonTypes";

const props = withDefaults(
    defineProps<{
      value:any,
      type:SimpleButtonTypeType,
      size:SimpleButtonSizeType
    }>(),
    {
      type: 'primary',
      size: 'normal'
    }
);
</script>

<template>
  <div
      class="app-badge"
      :class="[`type-${type}`, `size-${size}`]"
  >
    <span>&nbsp;</span>
    <div class="floating-badge">
      <slot>{{ value }}</slot>
    </div>
  </div>
</template>