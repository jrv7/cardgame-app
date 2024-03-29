<script setup lang="ts">

import {SimpleButtonSizeType, SimpleButtonTypeType} from "~/composables/customTypes/SimpleButtonTypes";
import {useLoadingState} from "~/composables/states";
const loadingState = useLoadingState();

const emit = defineEmits(['update:modelValue', 'clicked']);

const props = withDefaults(
    defineProps<{
      modelValue?: any,
      name?: string | null,
      value?: any,
      icon?: string | string[] | null,
      title?: string | null,
      type?: SimpleButtonTypeType,
      buttonType?: string | null,
      size?: SimpleButtonSizeType,
      disabled?: boolean,
      readonly?:boolean,
      iconLeft?: string | string[] | null,
      iconRight?: string | string[] | null,
      alignText?: string,
      loading?:boolean,
      useLoadingState?:boolean,
      quickClick?:boolean
    }>(), {
      modelValue: null,
      name: 'button',
      value: null,
      icon: null,
      title: null,
      type: 'primary',
      buttonType: 'button',
      size: 'normal',
      disabled: false,
      readonly: false,
      iconLeft: null,
      iconRight: null,
      alignText: 'center',
      loading: false,
      useLoadingState: false,
      quickClick: false
    }
);

const clickTimer:any = ref(null);
const lockTimer:any = ref(null);

const isClicked = computed(() => {
  return clickTimer.value !== null;
});

const isLoading = computed(() => {
  return props.loading || (props.useLoadingState && loadingState.value.loading);
})

const handleClick = () => {
  if (lockTimer.value !== null) return;
  if (props.disabled || props.readonly) return;
  if (props.value !== null) {
    emit('update:modelValue', props.value);
  }
  emit('clicked');

  lockTimer.value =  setTimeout(() => {
    clearTimeout(lockTimer.value);
    lockTimer.value = null;
  }, props.quickClick ? 100 : 600);

  clickTimer.value = setTimeout(() => {
    clearTimeout(clickTimer.value);
    clickTimer.value = null;
  }, 100);
};
</script>

<template>
  <button
      class="app-button"
      :type="buttonType"
      :class="[
          `type-${type}`,
          `size-${size}`,
          `align-text-${alignText}`,
          {
            'is-clicked': isClicked,
            'disabled': (disabled || isLoading),
            'readonly': (readonly),
            'has-icon': !!icon || !!iconLeft || !!iconRight,
            'has-left-icon': !!iconLeft,
            'has-right-icon': !!iconRight,
          }
      ]"
      :disabled="disabled || isLoading"
      @click.prevent="handleClick()"
  >
    <span class="icon icon-left" v-if="iconLeft">
      <slot name="icon-left">
        <fa-icon :icon="iconLeft" />
      </slot>
    </span>

    <span class="text"><slot></slot></span>

    <span class="icon icon-right" v-if="iconRight !== null">
      <slot name="icon-right">
        <fa-icon :icon="iconRight" />
      </slot>
    </span>
  </button>
</template>