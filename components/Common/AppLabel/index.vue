<script setup lang="ts">

import {SimpleButtonSizeType, SimpleButtonTypeType} from "~/composables/customTypes/SimpleButtonTypes";

const emit = defineEmits(['delete']);

const props = withDefaults(
    defineProps<{
      icon?:string,
    }>(),
    {
      icon: 'magnifying-glass',
    }
);
</script>

<template>
  <ul class="app-label">
    <li class="first-slot">
      <slot name="first-slot">
        <fa-icon :icon="['fas', icon]" />
      </slot>
    </li>
    <li class="text-slot">
      <slot></slot>
    </li>
    <li class="last-slot">
      <slot name="last-slot">
        <app-button
            type="link"
            size="xs-squared"
            @click="$emit('delete', true)"
        >
          <fa-icon :icon="['fas', 'xmark']" />
        </app-button>
      </slot>
    </li>
  </ul>
</template>