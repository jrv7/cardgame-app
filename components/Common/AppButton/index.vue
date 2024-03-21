<script setup lang="ts">

import {SimpleButtonSizeType, SimpleButtonTypeType} from "~/composables/customTypes/SimpleButtonTypes";

const emit = defineEmits(['update:modelValue', 'clicked']);

const props = withDefaults(
    defineProps<{
      modelValue?: any,
      name?: string | null,
      value?: any,
      icon?: string | string[] | null,
      title?: string | null,
      type?: SimpleButtonTypeType,
      size?: SimpleButtonSizeType,
      disabled?: boolean,
      iconLeft?: string | string[] | null,
      iconRight?: string | string[] | null,
      alignText?: string,
    }>(), {
      modelValue: null,
      name: 'button',
      value: null,
      icon: null,
      title: null,
      type: 'primary',
      size: 'normal',
      disabled: false,
      iconLeft: null,
      iconRight: null,
      alignText: 'center'
    }
);

const clickTimer:any = ref(null);
const lockTimer:any = ref(null);

const isClicked = computed(() => {
  return clickTimer.value !== null;
})

const handleClick = () => {
  if (lockTimer.value !== null) return;
  if (props.disabled) return;
  if (props.value !== null) emit('update:modelValue', props.value);
  emit('clicked');

  lockTimer.value =  setTimeout(() => {
    clearTimeout(lockTimer.value);
    lockTimer.value = null;
  }, 600);

  clickTimer.value = setTimeout(() => {
    clearTimeout(clickTimer.value);
    clickTimer.value = null;
  }, 100);
};
</script>

<template>
  <button
      class="app-button"
      type="button"
      :class="[
          `type-${type}`,
          `size-${size}`,
          `align-text-${alignText}`,
          {
            'is-clicked': isClicked,
            'disabled': disabled,
            'has-icon': !!icon,
            'has-left-icon': !!iconLeft,
            'has-right-icon': !!iconRight,
          }
      ]"
      @click.prevent="handleClick()"
  >
    <div class="icon icon-left" v-if="iconLeft">
      <slot name="icon-left">
        <fa-icon :icon="iconLeft" />
      </slot>
    </div>

    <span class="text"><slot></slot></span>

    <div class="icon icon-right">
      <slot name="icon-right">
        <fa-icon v-if="iconRight" :icon="iconRight" />
      </slot>
    </div>
  </button>
</template>