<script setup lang="ts">

import {SimpleButtonSizeType} from "~/composables/customTypes/SimpleButtonTypes";

const emit = defineEmits(['update:modelValue', 'changed', 'focused', 'blurred']);

const InputRef = ref(null);

const props = withDefaults(
    defineProps<{
      modelValue?: string | null,
      name?: string | null,
      label?: string | null,
      type?: string | null,
      subType?: string | null,
      size?: SimpleButtonSizeType | null,
      placeholder?: string | null,
      leftIcon?: string | string[] | null,
      rightIcon?: string | string[] | null,
      readonly?: boolean,
      disabled?: boolean,
      hintText?: string | null,
      errorText?: string | null,
      errors?: string[] | null,
      withErrors?:boolean,
      focused?:boolean
    }>(),
    {
      modelValue: null,
      name: null,
      label: null,
      type: 'text',
      subType: 'string',
      size: 'normal',
      placeholder: '',
      leftIcon: null,
      rightIcon: null,
      readonly: false,
      disabled: false,
      hintText: null,
      errorText: null,
      errors: null,
      withErrors: false,
      focused: false
    }
);

const active = ref(false);

const isActive = computed(() => {
  return !props.disabled && !props.readonly && ((props.modelValue !== null && props.modelValue !== '') || active.value)
});

const inputType = computed(() => {
  switch (props.subType) {
    case 'password': {
      return 'password'
    }

    default: {
      return 'text';
    }
  }
});

const inputValue = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit('update:modelValue', val);
    emit('changed', val);
  }
});

const setFocus = () => {
  active.value = true;
  emit('focused');
}
const setBlur = () => {
  active.value = false;
  emit('blurred');
}

onNuxtReady(() => {
  if (props.focused) {
    setTimeout(() => {
      if (InputRef?.value) {
        InputRef.value.focus();
      }
    }, 1000);
  }
})
</script>

<template>
  <div
      class="app-input"
      :class="[
          `size-${size}`,
          {
            'is-active': isActive,
            'is-disabled': disabled,
            'is-readonly': readonly,
            'has-label': (label !== null || placeholder !== null),
            'has-errors': withErrors
          }
      ]"
  >
    <div class="input-area">
      <div
          v-if="leftIcon"
          class="left-icon"
      >
        <slot name="left-icon">
          <fa-icon :icon="(['array', 'object'].includes(typeof leftIcon) ? ['fas', leftIcon] : leftIcon)" />
        </slot>
      </div>

      <span v-if="label || placeholder" class="input-label-placeholder">{{  (label ?? placeholder ?? '') }}</span>

      <input
          ref="InputRef"
          :type="inputType"
          v-model="inputValue"
          @focus="setFocus()"
          @blur="setBlur()"
      >

      <div
          v-if="rightIcon"
          class="right-icon"
      >
        <slot name="right-icon">
          <fa-icon :icon="(['array', 'object'].includes(typeof rightIcon) ? ['fas', rightIcon] : rightIcon)" />
        </slot>
      </div>
    </div>

    <div
        v-if="hintText || errorText || (errors && errors.length)"
        class="extra-text-area"
    >
      <div class="extra-messages">
        <slot name="hint-text" v-if="hintText">
          <span class="hint-text">{{ hintText }}</span>
        </slot>
        <slot name="error-text" v-if="errorText || (errors && errors.length)">
          <span
              v-if="errorText"
              class="error-text"
          >{{ errorText }}</span>
          <template v-else>
            <ul class="error-list">
              <li
                  v-for="error in errors" :key="error"
              >
                <span class="error-text">{{ error }}</span>
              </li>
            </ul>
          </template>
        </slot>
      </div>
    </div>
  </div>
</template>