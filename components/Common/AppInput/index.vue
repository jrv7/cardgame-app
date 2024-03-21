<script setup lang="ts">

import {SimpleButtonSizeType} from "~/composables/customTypes/SimpleButtonTypes";

const emit = defineEmits(['update:modelValue', 'changed', 'focused', 'blurred', 'submitted']);

const InputRef = ref(null);

const props = withDefaults(
    defineProps<{
      modelValue?: number | string | null,
      value?:any,
      name?: string | null,
      label?: string | boolean | null,
      type?: string | null,
      form?: string | null,
      subType?: string | null,
      autofocus?: boolean,
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
      focused?:boolean,
      showExtras?:boolean
    }>(),
    {
      modelValue: null,
      value: null,
      name: null,
      label: null,
      type: 'text',
      form: null,
      subType: 'string',
      autofocus: false,
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
      focused: false,
      showExtras: false
    }
);

const active = ref(false);

const isActive = computed(() => {
  return !props.disabled && !props.readonly && ((props.modelValue !== null && props.modelValue !== '') || props.value !== null || active.value)
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
    return props.modelValue ?? props.value;
  },
  set(val) {
    if (val !== null && !props.value) {
      emit('update:modelValue', val);
      emit('changed', val);
    }
  }
});

const setFocus = () => {
  active.value = true;
  emit('focused');
}
const closeTrigger:any = ref(null);
const keepOpen = () => {
  active.value = true;
  setTimeout(() => {
    clearTimeout(closeTrigger.value);
    closeTrigger.value = null;
    InputRef.value.focus();
  }, 100)
}
const setBlur = () => {
  closeTrigger.value = setTimeout(() => {
    active.value = false;
    clearTimeout(closeTrigger.value);
    closeTrigger.value = null;
    emit('blurred');
  }, 200)
}

const handleSubmitted = () => {
  emit('submitted');
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
            'show-extras': showExtras,
            'has-label': (label !== false && (label !== null || placeholder !== null)),
            'has-icon': (leftIcon !== null || rightIcon !== null),
            'has-left-icon': (leftIcon !== null),
            'has-right-icon': (rightIcon !== null),
            'has-errors': withErrors
          }
      ]"
      @click="keepOpen()"
  >
    <div class="input-area">
      <div
          v-if="leftIcon"
          class="left-icon"
      >
        <slot name="left-icon">
          <span class="left-icon-icon"><fa-icon :icon="(['array', 'object'].includes(typeof leftIcon) ? ['fas', leftIcon] : leftIcon)" /></span>
        </slot>
      </div>

      <span v-if="label || placeholder" class="input-label-placeholder">{{  (label || placeholder || '') }}</span>

      <input
          ref="InputRef"
          :form="form"
          :type="inputType"
          :autofocus="autofocus"
          v-model="inputValue"
          @focus="setFocus()"
          @blur="setBlur()"
          @keydown.enter="handleSubmitted()"
      >

      <div
          v-if="rightIcon"
          class="right-icon"
      >
        <slot name="right-icon">
          <span class="right-icon-icon"><fa-icon :icon="(['array', 'object'].includes(typeof rightIcon) ? ['fas', rightIcon] : rightIcon)" /></span>
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

    <div class="extras-container">
      <slot name="dropdown-container"></slot>
    </div>
  </div>
</template>