<script setup lang="ts">

const globalState = useGlobalState();

const props = withDefaults(
    defineProps<{
      value: string
    }>(), {
    }
);

const hasScryfallMap = computed(() => {
  return !!globalState.value?.mtgManaSymbolsCollection?.length;
});

const parseFromScryfall = (manaCost):{svg_uri:string}|null => {
  const manaSymbol = globalState.value?.mtgManaSymbolsCollection.find(i => i.symbol === manaCost);

  if (manaSymbol) {
    return manaSymbol;
  }
  return null;
}

const parsedCostItems = computed(() => {
  return props.value.split('}{').map(i => {
    return i.replaceAll('{', '')
        .replaceAll('}', '')
  }).map(i => `{${i}}`);
});
</script>

<template>
  <div class="app-mana-cost-symbol">
    <ul class="mana-cost">
      <template v-if="hasScryfallMap">
        <li class="mana-symbol-image" v-for="(mana, index) in parsedCostItems" :key="`mana-cost-symbol-${index}`">
          <img :src="parseFromScryfall(mana)?.svg_uri" :alt="value">
        </li>
      </template>
      <template v-else>
        <li
            v-for="(mana, index) in parsedCostItems" :key="`mana-cost-symbol-${index}`"
            class="mana-symbol-image"
            :class="[`mana_${mana}`]">{{ mana }}</li>
      </template>
    </ul>
  </div>
</template>