<script setup lang="ts">


import {SimpleButtonSizeType} from "~/composables/customTypes/SimpleButtonTypes";
import {SelectInputOptionType} from "~/composables/customTypes/SelectInputOptionType";
const refOpenControlInput = ref(null);
const emit = defineEmits(['update:modelValue', 'changed', 'focused', 'blurred', 'submitted']);

const props = withDefaults(
    defineProps<{
      modelValue?: number,
      options: SelectInputOptionType[] | null,
      name?: string | null,
      label?: string | boolean | null,
      type?: string | null,
      form?: string | null,
      subType?: string | null,
      autofocus?: boolean,
      size?: SimpleButtonSizeType | null,
      placeholder?: string | boolean | null,
      leftIcon?: string | string[] | null,
      rightIcon?: string | string[] | null,
      readonly?: boolean,
      disabled?: boolean,
      hintText?: string | null,
      errorText?: string | null,
      errors?: string[] | null,
      withErrors?:boolean,
      focused?:boolean,
      preventCloseOnSelect?: boolean
    }>(),
    {
      modelValue: null,
      options: null,
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
      preventCloseOnSelect: false
    }
);

const isOpen = ref(false);
const openTrigger:any = ref(null);

const inputValue = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit('update:modelValue', val);
    emit('changed', val);
  }
});

const selectedOption = computed(() => {
  if (!props.modelValue) return null;
  if (!props.options?.length) return null;
  return props.options?.find(i => i.value === props.modelValue);
})

const selectedText = computed(() => {
  if (props.options?.length) {
    const selected = props.options.find(i => i.value === props.modelValue);

    if (selected) {
      return useNuxtApp().$_Tt(selected.text ?? selected.description ?? selected.value);
    }
  }

  return useNuxtApp().$_Tt('make_selection');
});

const active = ref(false);

const setFocus = () => {
  active.value = true;
  emit('focused');
}
const setBlur = () => {
  active.value = false;
  emit('blurred');
}

const handleSubmitted = () => {
  emit('submitted');
}

const handleSelection = (option) => {
  if (option.value !== null) {
    emit('update:modelValue', option.value);
  }
}

const handleOpen = () => {
  if (!isOpen.value) {
    refOpenControlInput.value.focus();
    isOpen.value = true;
  } else if (props.preventCloseOnSelect) {
    setTimeout(() => {
      clearTimeout(openTrigger.value);
      openTrigger.value = null;
      refOpenControlInput.value.focus();
    }, 100)
  }
}

const handleClose = () => {
  openTrigger.value = setTimeout(() => {
    isOpen.value = false;
    clearTimeout(openTrigger.value);
    openTrigger.value = null;
  }, 400)
}
</script>

<template>
  <div
      class="app-input-select"
      :class="{'open': isOpen}"
      @click="handleOpen()"
  >
    <input
        ref="refOpenControlInput"
        type="text"
        class="open-control-input"
        @blur.prevent="handleClose()"
    >

    <div class="input-area">
      <div
          v-if="selectedOption?.icon || leftIcon"
          class="left-icon"
      >
        <slot name="left-icon">
          <template v-if="selectedOption?.icon">
            <fa-icon :icon="(['array', 'object'].includes(typeof selectedOption?.icon) ? ['fas', selectedOption?.icon] : selectedOption?.icon)" />
          </template>
          <template v-else>
            <fa-icon :icon="(['array', 'object'].includes(typeof leftIcon) ? ['fas', leftIcon] : leftIcon)" />
          </template>
        </slot>
      </div>

      <span v-if="label || placeholder" class="input-label-placeholder">{{  (label ?? placeholder ?? '') }}</span>

      <input
          ref="InputRef"
          :form="form"
          type="text"
          readonly
          v-model="selectedText"
          @focus="setFocus()"
          @blur="setBlur()"
          @keydown.enter="handleSubmitted()"
      >

      <div
          class="right-icon"
      >
        <slot name="right-icon">
          <fa-icon :icon="['array', 'chevron-down']" />
        </slot>
      </div>
    </div>

    <div class="options-area">
      <ul class="options-list">
        <template
            v-for="option in options" :key="option"
        >
          <li>
            <app-input-select-option
                v-bind="option"
                :selected="option.value === modelValue"
                @selected="handleSelection(option)"
            />
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>