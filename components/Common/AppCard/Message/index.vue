<script setup lang="ts">
import {AppMessageType} from "~/composables/customTypes/AppMessageType";

const emit = defineEmits(['removed']);

const props = withDefaults(
    defineProps<{
      message: AppMessageType,
      allowRemove?: boolean
    }>(),
    {
      allowRemove: true
    }
);

const parsedIcon = computed(() => {
  switch (props.message.type) {
    case 'error': {
      return ['fas', 'triangle-exclamation'];
    }
    case 'success': {
      return ['fas', 'check'];
    }
    case 'warning': {
      return ['fas', 'circle-exclamation'];
    }
    default: {
      return ['fas', 'circle-info'];
    }
  }
});

const handleRemove = () => {
  emit('removed', true);
}
</script>

<template>
  <div
      class="app-card-message"
      :class="[`type-${message.type}`]"
  >
    <div class="icon">
      <span><fa-icon :icon="parsedIcon" /></span>
    </div>

    <span class="text" v-html="$_Tt(message.message ?? message.text)" />

    <app-button-icon
        type="icon"
        size="xs"
        @clicked="handleRemove()"
    >
      <fa-icon :icon="['fas', 'xmark']" />
    </app-button-icon>
  </div>
</template>