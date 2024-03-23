<script setup lang="ts">

const props = withDefaults(
    defineProps<{
      value: string
    }>(), {
    }
);

const parsedCostItems = computed(() => {
  return props.value.split('}{').map(i => {
    return i.replaceAll('{', '')
        .replaceAll('}', '')
        .replaceAll('/', '--')
  }).map(i => `${i}`);
});
</script>

<template>
  <div class="app-mana-cost-symbol">
    <ul class="mana-cost">
      <template v-for="(mana, index) in parsedCostItems" :key="`mana-cost-symbol-${index}`">
        <li class="mana-symbol-image" :class="[`mana_${mana}`]">{{ mana }}</li>
      </template>
    </ul>
  </div>
</template>