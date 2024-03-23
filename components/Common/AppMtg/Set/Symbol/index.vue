<script setup lang="ts">

const props = withDefaults(
    defineProps<{
      value: string,
      rarity: string,
      name?: string
    }>(), {
      rarity: 'common',
      name: 'MTG'
    }
);

const parsedItems = computed(() => {
  return props.value.toLowerCase().split('}{').map(i => {
    return i.replaceAll('{', '')
        .replaceAll('}', '')
        .replaceAll('/', '--')
  }).map(i => `${i}`);
});

const parseRarity = computed(() => {
  return props.rarity.toLowerCase().replaceAll(' ', '');
});
</script>

<template>
  <div class="app-mtg-set-symbol">
    <ul class="set-symbols-list">
      <template v-for="(item, index) in parsedItems" :key="`set-symbol-${index}`">
        <li
            class="set-icon-rarity"
            :title="name"
        >
          <i :class="`ss ss-${item} ss-${parseRarity}`"></i>
        </li>
      </template>
    </ul>
  </div>
</template>