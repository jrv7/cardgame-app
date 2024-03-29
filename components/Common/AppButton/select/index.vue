<script setup lang="ts">

import {SimpleButtonSizeType, SimpleButtonTypeType} from "~/composables/customTypes/SimpleButtonTypes";
import {DropdownContainerPositionType} from "~/composables/customTypes/DropdownTypes";

const refFocusInput = ref(null);

const emit = defineEmits(['update:modelValue', 'clicked']);

const props = withDefaults(
    defineProps<{
      modelValue?: any,
      options?:{text:string, value:any, selected?:boolean}[]|null,
      name?: string | null,
      value?: any,
      icon?: string | string[] | null,
      title?: string | null,
      type?: SimpleButtonTypeType,
      size?: SimpleButtonSizeType,
      disabled?: boolean,
      iconLeft?: string | string[] | null,
      iconRight?: string | string[] | null,
      spin?: boolean,
      position?: DropdownContainerPositionType | null,
      loading?:boolean,
      useLoadingState?:boolean
    }>(),
    {
      modelValue: null,
      options: null,
      name: 'button',
      value: null,
      icon: null,
      title: null,
      type: 'primary',
      size: 'normal',
      disabled: false,
      iconLeft: null,
      iconRight: null,
      spin: false,
      position: "bottom",
      loading: false,
      useLoadingState: false
    }
);

const inputValue = ref(props.options?.find(i => i.selected)?.value || null);
const parseInputValue = computed({
  get: () => {
    return `${props.modelValue.value}`;
  },
  set: (value:any) => {
    inputValue.value = value;
    emit('update:modelValue', value);
  }
});

const btnValue = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', props.value);
  }
});

const visible = ref(false);
const visibilityTrigger:any = ref(null);

const handleClick = () => {
  if (!visible.value) {
    visible.value = true;
    setTimeout(() => {
      refFocusInput.value.focus();
    }, 400)
  } else {
    clearTimeout(visibilityTrigger.value);
    visible.value = false;
  }
}

const closeDropdown = () => {
  visibilityTrigger.value = setTimeout(() => {
    visible.value = false;
    clearTimeout(visibilityTrigger.value);
  }, 200);
}
</script>

<template>
  <div
      class="app-button-select"
      :class="{'visible': visible}"
  >
    <input type="text" class="focus-input" ref="refFocusInput" @blur="closeDropdown()">
    <app-button
        class="app-button-icon"
        :name="name"
        :value="value"
        v-model="btnValue"
        :title="title"
        :type="type"
        :size="size"
        :disabled="disabled"
        :use-loading-state="useLoadingState"
        :loading="loading"
        @clicked="handleClick()"
    >
      <slot name="button-slot">
        <template v-if="parseInputValue">
          {{ options?.find(i => i.selected)?.text || $_Tt('select') }}
        </template>
      </slot>
    </app-button>

    <div
        class="dropdown-container is-active"
        :class="[`position-${position}`]"
    >
      <slot>
        <ul class="options-list">
          <template v-for="(opt, oIndex) in options" :key="`app-select-option-${oIndex}`">
            <li>
              <app-button
                  type="link"
                  size="xs"
                  align-text="left"
                  :value="opt.value"
                  v-model="parseInputValue"
              >{{ opt.text }}</app-button>
            </li>
          </template>
        </ul>
      </slot>
    </div>
  </div>
</template>