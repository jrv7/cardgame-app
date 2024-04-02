<script setup lang="ts">
const mtgState = useMtgState();

const props = withDefaults(
    defineProps<{
      value?:string,
      small?:boolean
    }>(), {
      small: false
    }
);

const parseCostToArray = computed(() => {
  if (!props.value) {
    return null;
  }

  return props.value.split('}{').map(i => {
    const symbol = `{${i.replaceAll('{', '').replaceAll('}', '')}}`;

    const manaSymbol = mtgState.value.scryfallSymbols.find(i => i.symbol === symbol);
    if (manaSymbol) {
      return manaSymbol;
    } else {
      return {
        scg_uri: null,
        symbol: symbol
      };
    }
  })
});
</script>

<template>
  <ul
      class="app-mtg-mana-cost-translator"
      :class="{'small': small}"
  >
    <li v-for="(item, index) in parseCostToArray" :key="`mana-symbol-${index}`">
      <template v-if="item.svg_uri">
        <img :src="item.svg_uri" :alt="item.symbol">
      </template>
      <template v-else>
        {{ item }}
      </template>
    </li>
  </ul>
</template>