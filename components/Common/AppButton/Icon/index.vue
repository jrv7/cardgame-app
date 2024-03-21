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
      buttonType?: string | null,
      size?: SimpleButtonSizeType,
      disabled?: boolean,
      iconLeft?: string | string[] | null,
      iconRight?: string | string[] | null,
      spin?: boolean,
      loading?:boolean,
      useLoadingState?:boolean
    }>(),
    {
      modelValue: null,
      name: 'button',
      value: null,
      icon: null,
      title: null,
      type: 'primary',
      buttonType: 'button',
      size: 'normal',
      disabled: false,
      iconLeft: null,
      iconRight: null,
      spin: false,
      loading: false,
      useLoadingState: false
    }
);

const btnValue = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', props.value);
  }
});

const handleClick = () => {
  emit('clicked', true);
}
</script>

<template>
  <app-button
      class="app-button-icon"
      :name="name"
      :value="value"
      v-model="btnValue"
      :title="title"
      :type="type"
      :button-type="buttonType"
      :size="size"
      :use-loading-state="useLoadingState"
      :loading="loading"
      :disabled="disabled || loading"
      @clicked="handleClick()"
  >
    <slot></slot>
  </app-button>
</template>