<script setup lang="ts">

import {SimpleButtonSizeType, SimpleButtonTypeType} from "~/composables/customTypes/SimpleButtonTypes";
import {CardInterface} from "~/composables/entity/CardInterface";

const mtgState = useMtgState();

const props = withDefaults(
    defineProps<{
      card:CardInterface,
      small?:boolean,
      hasCrown?:boolean,
      hideCost?:boolean,
    }>(), {
      small: false,
      hasCrown:false,
      hideCost: false
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
    const symbol = `{${i.replaceAll('{', '').replaceAll('}', '').replaceAll('/P', '')}}`;

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
    case (occurrences.length === 0): {
      if (props.card.getType().includes('Artifact')) {
        return 'artifact';
      }
      return 'colorless';
    }
    case (occurrences.length === 1): return occurrences.map(i => i.replaceAll('{','').replaceAll('}','').replaceAll('/','_')).join('-');
    case (occurrences.length === 2): {
      return occurrences.map(i => i.replaceAll('{','').replaceAll('}','').replaceAll('/','')).join('');
    }
    case (occurrences.length > 1): {
      return 'multicolored';
    }
    default: return 'colorless';
  }
});
</script>

<template>
  <div
      class="app-mtg-card-header"
      :class="[`color-identity-${parseCardColor}`, {'has-crown': hasCrown, 'small': small}]"
  >
    <div
        class="decoration"
        v-if="hasCrown"
        :class="[`crown-${parseCardColor}`]"
    >
    </div>

    <div class="header-content">
      <div class="dog-tag">
        <div class="header-plate"></div>
        <div class="name-plate"></div>
        <div class="name">
          <span>{{ card.getName() }}</span>
        </div>
        <div class="cost" v-show="!hideCost">
          <app-mtg-mana-cost-translate
              :value="card.getManaCost()!"
              :small="small"
          />
        </div>
      </div>
    </div>

    <slot name="details" :card="card">
      <div class="details"></div>
    </slot>
  </div>
</template>