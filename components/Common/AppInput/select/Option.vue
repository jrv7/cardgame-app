<script setup lang="ts">
const emit = defineEmits(['selected']);

const props = withDefaults(
    defineProps<{
      value: number,
      text: string,
      description?: string,
      selected: boolean,
      disabled?: boolean
    }>(),
    {
      text: 'Option',
      description: null,
      selected: false,
      disabled: false
    }
);

const handleSelection = () => {
  if (props.disabled) return;

  emit('selected');
}
</script>

<template>
  <div
      class="select-option"
      :class="{'selected': selected, 'disabled': disabled}"
      @click="handleSelection()"
  >
    <span class="option-text">{{ $_Tt(text) }}</span>
    <span class="option-description">{{ $_Tt(description) }}</span>

    <div class="disabled-icon" v-if="disabled">
      <fa-icon :icon="['fas', 'lock']" />
    </div>
  </div>
</template>