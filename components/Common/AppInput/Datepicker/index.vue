<script setup lang="ts">

const emit = defineEmits(['update:modelValue', 'changed']);

const props = withDefaults(
    defineProps<{
      modelValue?: number | string | null,
      format?: string | null,
      delimiter?: string | null,
      timeSelector?: boolean | null,
    }>(),
    {
      modelValue: null,
      format: 'Y-m-d',
      delimiter: '-',
      timeSelector: false,
    }
);

const visiblePicker = ref(false);

const inputValue:string|null = ref(null) as string|null;

const parseValue = computed({
  get: () => {
    return inputValue.value;
  },
  set: (value:any) => {
    inputValue.value = value;
    emit('update:modelValue', value)
  }
});

const showPicker = () => {
  visiblePicker.value = true;
}

const hidePicker = () => {
  visiblePicker.value = false;
}
</script>

<template>
  <app-input
      type="text"
      size="sm"
      :placeholder="$_Tt('choose')"
      :value="null !== inputValue ? $dateFormat(inputValue, format) : null"
      left-icon="calendar"
      :show-extras="visiblePicker"
      @focused="showPicker()"
      @blurred="hidePicker()"
  >
    <template #dropdown-container>
      <app-date-time-picker
          v-model="parseValue"
          :time-selector="timeSelector"
      ></app-date-time-picker>
    </template>
  </app-input>
</template>