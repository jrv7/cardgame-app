<script setup lang="ts">

import {SimpleButtonSizeType, SimpleButtonTypeType} from "~/composables/customTypes/SimpleButtonTypes";
import {CardInterface} from "~/composables/entity/CardInterface";

const mtgState = useMtgState();

const props = withDefaults(
    defineProps<{
      card:CardInterface,
      small?:boolean
    }>(), {
      small: false
    }
);

const parseCardColor = computed(() => {
  const cardMana = `${props.card.getManaCost()??''}${props.card.getIdentityCost()??''}`;
  if (!cardMana.length) {
    if (props.card.getTypes().map(i => i.name).includes('Land'))
      return 'land';
    return 'colorless';
  }

  let occurrences = [];

  cardMana.split('}{').forEach(i => {
    const symbol = `{${i.replaceAll('{', '').replaceAll('}', '')}}`;

    const manaSymbol = mtgState.value.scryfallSymbols.find(i => i.symbol === symbol);
    if (manaSymbol) {
      if (manaSymbol.colors.length) {
        if (!occurrences.find(j => j === manaSymbol.symbol)) {
          occurrences.push(manaSymbol.symbol);
        }
      }

      return manaSymbol;
    } else {
      return null;
    }
  })?.filter(i => i !== null);

  switch (true) {
    case (occurrences.length === 0): return 'colorless';
    case (occurrences.length === 1): return occurrences.map(i => i.replaceAll('{','').replaceAll('}','').replaceAll('/','_')).join('-');
    case (occurrences.length > 1): return 'multicolored';
    default: return 'colorless';
  }

  // return occurrences.map(i => {
  //   return i.replaceAll('{', '').replaceAll('}', '').replaceAll('/', '_');
  // });
});
</script>

<template>
  <div
      class="app-mtg-card-footer"
      :class="[`color-identity-${parseCardColor}`, {'small': small}]"
  >
    <div class="decoration"></div>
    
    <div class="dog-tag">
      <div class="header-plate"></div>
      <div class="name-plate"></div>
      <div class="name">
        <span>{{ card.getType() }}</span>
      </div>
    </div>
  </div>
</template>