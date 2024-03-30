<script setup lang="ts">

import {SimpleButtonSizeType, SimpleButtonTypeType} from "~/composables/customTypes/SimpleButtonTypes";
import {DeckInterface} from "~/composables/entity/DeckInterface";
import {CardInterface} from "~/composables/entity/CardInterface";
import {Card} from "~/composables/entity/Card";

const mtgState = useMtgState();

const props = withDefaults(
    defineProps<{
      deck:DeckInterface
    }>(), {
    }
);

const ready = ref(false);
const DeckCards:CardInterface[] = ref([]) as CardInterface[];

const originalFilters = ref({
  simpleSearch: [],
  stringSearch: null,
  collectionsSets: [],
  types: [],
  subtypes: [],
  supertypes: [],
  colors: mtgState.value.colors,
  identityColors: [],
  filterColorsIn: 'colors',
  colorMatch: 'any',
  borderless: false,
  landsOnly: false
});
const filters = ref(useNuxtApp().$deepClone(originalFilters.value));
const parsedFilters = computed({
  get: () => {
    return filters.value;
  },
  set: (value) => {
    filters.value = value;
    // useLocalApiPost(`/pages${route.path}/filters/set`, value)
    //     .then(() => {
    //       filters.value = value;
    //     });
  }
});

const filteredMana = ref(useNuxtApp().$deepClone(mtgState.value.colors));
const parsedFilteredMana = computed({
  get: () => {
    return filteredMana.value;
  },
  set: (value:{code:string, name:string, id?:number}[]) => {
    filteredMana.value = value;

    let currentFilters = useNuxtApp().$deepClone(filters.value);
    currentFilters.colors = value;
    parsedFilters.value = currentFilters;
    //
    // clearTimeout(listReloadTrigger.value);
    // listReloadTrigger.value = null;
    // listReloadTrigger.value = setTimeout(() => {
    //   TableCoreRef.value.reload();
    //   clearTimeout(listReloadTrigger.value);
    //   listReloadTrigger.value = null;
    // }, 1200);
  }
});

const parseColorFilterTypeFilter = computed({
  get: () => {
    return filters.value.filterColorsIn;
  },
  set: async (value:string) => {
    let currentFilters = useNuxtApp().$deepClone(filters.value);
    currentFilters.filterColorsIn = value;

    parsedFilters.value = currentFilters;
    //
    // listReloadTrigger.value = setTimeout(() => {
    //   TableCoreRef.value.reload();
    //   clearTimeout(listReloadTrigger.value);
    //   listReloadTrigger.value = null;
    // }, 400)
  }
});

const parsedColorMatchFilter = computed({
  get: () => {
    return filters.value.colorMatch;
  },
  set: (value:string) => {
    let currentFilters = useNuxtApp().$deepClone(filters.value);
    currentFilters.colorMatch = value;
    parsedFilters.value = currentFilters;

    // clearTimeout(searchTrigger.value);
    // searchTrigger.value = null;
    // searchTrigger.value = setTimeout(() => {
    //   TableCoreRef.value.reload();
    //   clearTimeout(searchTrigger.value);
    //   searchTrigger.value = null;
    // }, 200);
  }
});

const parsedBorderlessFilter = computed({
  get: () => {
    return filters.value.borderless;
  },
  set: (value:boolean) => {
    let currentFilters = useNuxtApp().$deepClone(filters.value);
    currentFilters.borderless = value;
    parsedFilters.value = currentFilters;

    // clearTimeout(searchTrigger.value);
    // searchTrigger.value = null;
    // searchTrigger.value = setTimeout(() => {
    //   TableCoreRef.value.reload();
    //   clearTimeout(searchTrigger.value);
    //   searchTrigger.value = null;
    // }, 200);
  }
});

const parsedLandsOnlyFilter = computed({
  get: () => {
    return filters.value.landsOnly;
  },
  set: (value:boolean) => {
    let currentFilters = useNuxtApp().$deepClone(filters.value);
    currentFilters.landsOnly = value;
    parsedFilters.value = currentFilters;

    // clearTimeout(searchTrigger.value);
    // searchTrigger.value = null;
    // searchTrigger.value = setTimeout(() => {
    //   TableCoreRef.value.reload();
    //   clearTimeout(searchTrigger.value);
    //   searchTrigger.value = null;
    // }, 200);
  }
});

onBeforeMount(async () => {
  await useDynamicPost(`/decks/${props.deck.getId()}/cards`)
      .then(({data, success}) => {
        if (success) {
          if (data.length) {
            console.log('Cards', data);
            DeckCards.value = data.map(i => {
              return new Card(i.card);
            })
          }
          ready.value = true;
        }
      })
})
</script>

<template>
  <div class="app-mtg--deck-builder" v-if="ready">
    <div class="deck-specs">
      <ul class="deck-list">
        <template v-for="(card, index) in DeckCards" :key="`deck-card-${card.getId()}`">
          <li class="deck-card">
            <app-mtg-card-header :card="card" />
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>