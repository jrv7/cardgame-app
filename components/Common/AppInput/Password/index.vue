<script setup lang="ts">
const emit = defineEmits(['update:modelValue', 'changed']);

const props = withDefaults(
    defineProps<{
      name: string,
      modelValue?: string | null,
      placeholder?: string | null,
      hintText?: string | null,
      errorText?: string | null,
      errors?: string[] | null
    }>(),
    {
      modelValue: null,
      placeholder: 'password_placeholder',
      hintText: null,
      errorText: null,
      errors: null
    }
);

const inputValue = computed({
  get() { return props.modelValue; },
  set(value) {
    emit('update:modelValue', value);
    emit('changed', true);
  }
});

const makeVisible = ref(false);

const setVisible = (value: boolean = true) => {
  makeVisible.value = value;
}

const inputSubtype = computed(() => {
  return makeVisible.value ? 'text' : 'password';
});
</script>

<template>
  <app-input
      class="app-input-password"
      type="string"
      :sub-type="inputSubtype"
      :name="name"
      left-icon="lock"
      right-icon="eye"
      :error-text="errorText"
      :errors="errors"
      v-model="inputValue"
      :placeholder="$_Tt(placeholder)"
  >
    <template #right-icon>
      <slot name="right-icon">
        <app-button-icon
            type="link"
            size="xs"
            :disabled="!inputValue"
            @mousedown="setVisible()"
            @mouseup="setVisible(false)"
            @dragend="setVisible(false)"
            @mouseleave="setVisible(false)"
        >
          <span class="text-size-lg"><fa-icon :icon="['fas', 'eye']" /></span>
        </app-button-icon>
      </slot>
    </template>
  </app-input>
</template>