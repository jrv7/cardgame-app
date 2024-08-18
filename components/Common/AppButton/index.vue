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

<style lang="scss" scoped>

.app-button {
  position: relative;
  top: 0;
  left: 0;
  display: flex;
  flex-flow: nowrap;
  width: fit-content;
  transition: filter .4s ease-in-out, box-shadow .1s ease-in-out;

  & > span.text {
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &.align-text-center {
    & > span.text {
      text-align: center;
    }
  }

  &.align-text-left {
    & > span.text {
      text-align: left !important;
      justify-content: flex-start !important;
    }
  }

  &.align-text-right {
    & > span.text {
      text-align: right !important;
      justify-content: flex-end !important;
    }
  }

  & > .icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    margin: auto 0;

    &.icon-left {
      left: 12px;
    }

    &.icon-right {
      right: 12px;
    }
  }

  &.has-left-icon {
    padding-right: 24px;
  }

  &.has-right-icon {
    padding-left: 24px;
  }


  &.disabled {
    cursor: not-allowed;
    color: var(--c-fiducial-grey) !important;
  }

  &:not(.disabled):not(.readonly) {
    cursor: pointer;

    &:hover {
      filter: saturate(200%);
    }

    &.is-clicked {
      box-shadow: none;
      top: 1px;
      left: 1px;
    }
  }

  &.size-normal {
    height: 48px;
    min-height: 48px;
    max-height: 48px;
    border-radius: 32px;

    & > .icon {
      font-size: 18px;
    }
  }

  &.size-xs {
    height: 24px;
    min-height: 24px;
    max-height: 24px;
    border-radius: 20px;

    & > .icon {
      font-size: 12px;
    }
  }

  &.size-sm {
    height: 34px;
    min-height: 34px;
    max-height: 34px;
    border-radius: 20px;

    & > .icon {
      font-size: 12px;
    }
  }

  &.size-square-sm {
    width: 24px;
    min-width: 24px;
    max-width: 24px;
    height: 24px;
    min-height: 24px;
    max-height: 24px;
    border-radius: 4px;

    & > .icon {
      font-size: 12px;
    }
  }

  &.size-sm-squared {
    height: 32px;
    min-height: 32px;
    max-height: 32px;
    border-radius: 4px;

    & > .icon {
      font-size: 12px;
    }
  }

  &.size-xs-squared {
    height: 24px;
    min-height: 24px;
    max-height: 24px;
    border-radius: 4px;

    & > .icon {
      font-size: 12px;
    }
  }

  &.type-primary {
    background-color: var(--color-primary-blue);
    border: 1px solid var(--color-primary-blue);
    box-shadow: 0 1px 4px 0 rgba(0,0,0,.13), 0 1px 3px 0 rgba(0,0,0,.22);
    color: var(--c-white);
    font-weight: 600;
  }

  &.type-secondary {
    background-color: var(--color-secondary-grey);
    border: 1px solid var(--color-secondary-grey);
    box-shadow: 0 1px 4px 0 rgba(0,0,0,.13), 0 1px 3px 0 rgba(0,0,0,.22);
    color: var(--color-primary-dark-blue);
    font-weight: 600;
  }

  &.type-warning {
    background-color: var(--c-button-warning-background);
    border: 1px solid var(--c-button-warning-border);
    box-shadow: 0 1px 4px 0 rgba(0,0,0,.13), 0 1px 3px 0 rgba(0,0,0,.22);
    color: var(--c-white);
    font-weight: 600;
  }

  &.type-success {
    background-color: var(--app-blue-300);
    border: 1px solid var(--app-blue-200);
    box-shadow: 0 1px 4px 0 rgba(0,0,0,.13), 0 1px 3px 0 rgba(0,0,0,.22);
    color: var(--c-white);
    font-weight: 600;
  }

  &.type-danger, &.type-error {
    background-color: var(--color-secondary-red);
    border: 1px solid var(--color-secondary-red-dark);
    box-shadow: 0 1px 4px 0 rgba(0,0,0,.13), 0 1px 3px 0 rgba(0,0,0,.22);
    color: var(--c-white);
    font-weight: 600;
  }

  &.type-link {
    background: none;
    border: none;
    box-shadow: none;
    padding-left: 0;
    padding-right: 0;

    & > .text, & > .icon {
      color: var(--color-primary-dark-blue);
    }
  }

  &.type-icon {
    background: none;
    border: none;
    box-shadow: none;

    &.size-xs {
      width: 24px !important;
      min-width: 24px !important;
      max-width: 24px !important;
      height: 24px !important;
      min-height: 24px !important;
      max-height: 24px !important;
    }

    &.size-xs-auto {
      margin-top: auto;
      margin-bottom: auto;
    }

    & > .text, & > .icon {
      color: var(--c-fiducial-dark-grey);
    }
  }

  &.disabled {
    &.type-link {
      & > .text, & > .icon {
        color: var(--c-fiducial-lighter-grey);
      }
    }
  }
}

.app-button-select {
  position: relative;
  display: flex;

  input.focus-input {
    position: absolute;
    width: 1px !important;
    height: 1px !important;
    opacity: 0 !important;
  }

  .dropdown-container {
    position: absolute;
    max-height: 0;
    overflow: hidden;
    transition: all .4s ease-in-out;
    background-color: #fff;
    padding: 0;
    border-radius: 4px;

    &.position-bottom-right {
      top: 100%;
      right: 0;
      margin-top: 8px;
    }

    &.position-bottom-left {
      top: 100%;
      left: 0;
      margin-top: 8px;
    }

    &.position-bottom {
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      margin-top: 8px;
    }
  }

  &.visible {
    .dropdown-container {
      overflow: visible;
      max-height: 100vh;
    }
  }

  .options-list {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 0;
    padding: 0;

    & > li {
      position: relative;
      display: flex;
      padding: 4px 12px;
      font-weight: 400;
      border-top: 1px solid #ccc;

      &:first-of-type {
        border-top: none;
      }

      &:last-of-type {
        padding-bottom: 8px;
      }

      & > span {
        position: relative;
        display: flex;
        margin: auto 0;

        &.flag-icon {
          margin-right: 12px;
          img {
            width: 32px;
          }
        }
      }

      &:not(.disabled) {
        &:hover {
          font-weight: 600 !important;
        }
      }
    }
  }
}

.app-button-group {
  position: relative;
  display: flex;
  flex-flow: nowrap;

  & > .app-button, & > .app-input,
  & > .app-button-select > .app-button {
    margin: 0 !important;
    height: 48px !important;

    &:not(:first-of-type):not(:last-of-type) {
      border-radius: 0;

      & > .input-area {
        border-radius: 0;
      }
    }

    &:first-of-type {
      border-top-right-radius: 0 !important;
      border-bottom-right-radius: 0 !important;

      & > .input-area {
        border-top-right-radius: 0 !important;
        border-bottom-right-radius: 0 !important;
      }
    }

    &:last-of-type {
      border-top-left-radius: 0 !important;
      border-bottom-left-radius: 0 !important;

      & > .input-area {
        border-top-left-radius: 0 !important;
        border-bottom-left-radius: 0 !important;
      }
    }
  }
}
</style>