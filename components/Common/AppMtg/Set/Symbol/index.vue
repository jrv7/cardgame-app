<script setup lang="ts">
const emit = defineEmits(['click']);

const props = withDefaults(
    defineProps<{
      value: string,
      rarity: string,
      name?: string,
      canHover?:boolean,
      loading?:boolean
    }>(), {
      rarity: 'common',
      name: 'MTG',
      canHover: false,
      loading: false
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

const hovered = ref(false);
const onMouseEnter = () => {
  if (!props.canHover) return;
  hovered.value = true;
}
const onMouseLeave = () => {
  if (!props.canHover) return;
  hovered.value = false;
}
const handleClick = () => {
  if (!props.canHover) return;
  emit('click');
}
</script>

<template>
  <div
      class="app-mtg-set-symbol"
      @click.prevent="handleClick()"
      @mouseenter="onMouseEnter()"
      @mouseleave="onMouseLeave()"
  >
    <ul class="set-symbols-list" :class="{'hoverable': (canHover && !loading)}">
      <template v-for="(item, index) in parsedItems" :key="`set-symbol-${index}`">
        <li
            class="set-icon-rarity"
            :title="name"
        >
          <i :class="`ss ss-${item} ss-${hovered ? 'rare' : parseRarity}`"></i>
        </li>
      </template>
    </ul>
  </div>
</template>