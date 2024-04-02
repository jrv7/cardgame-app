<script setup lang="ts">

import {DeckInterface} from "~/composables/entity/DeckInterface";
import {CardInterface} from "~/composables/entity/CardInterface";
import {Card} from "~/composables/entity/Card";

const mtgState = useMtgState();
const mtgCardListRef = ref(null);

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

const defaultColors = computed(() => {
  return mtgState.value.colors;
});

const cardInDeck = (card) => {
  return !!DeckCards.value.find(i => i.getId() === card.getId());
}

const addCardToDeck = async  (card:CardInterface) => {
  await useDynamicPost(`/decks/${props.deck.getId()}/cards/add`, {cardId: card.getId()})
      .then((addResp) => {
        fetchDeckList()
      })
}

const showCardDetails = (card) => {
  mtgCardListRef.value.openCardViewModal(card);
}

const fetchDeckList = async () => {
  return new Promise((resolve, reject) => {
    useDynamicPost(`/decks/${props.deck.getId()}/cards`)
        .then(({data, success}) => {
          if (success) {
            if (data.length) {
              DeckCards.value = data.map(i => {
                return new Card(i.card);
              })
            }

            resolve();
          } else {
            reject('Could not fetch list');
          }
        })
        .catch((e) => {
          reject('Could not fetch list', e);
        })
  })
}

onBeforeMount(async () => {
  await fetchDeckList()
      .then(() => {
        ready.value = true;
      })
})
</script>

<template>
  <div class="app-mtg--deck-builder">
    <div class="card-list">
      <app-mtg-card-list
          ref="mtgCardListRef"
          :prefilter-colors="[...deck?.getPrimaryCard()?.getColors(), ...defaultColors.filter(i => i.code === '{C}')]"
          horizontal-scroll
          :list-size="8"
          :page-size="24"
      >
        <template
            #indicator="{card}"
        >
          <div class="in-deck-indicator"
               v-if="cardInDeck(card)" />
        </template>
        
        <template #actions="{card}">
          <ul class="deck-builder-card-actions-slot">
            <li>
              <app-button
                  type="primary"
                  size="xs"
                  @click="showCardDetails(card)"
              >
                <fa-icon :icon="['fas', 'magnifying-glass-plus']" />
              </app-button>
            </li>
            <li class="spacer" />
            <li>
              <app-button
                  type="primary"
                  size="xs"
                  @click="addCardToDeck(card)"
              >
                <fa-icon :icon="['fas', 'plus']" />
              </app-button>
            </li>
          </ul>
        </template>
      </app-mtg-card-list>
    </div>


    <div class="deck-specs">
      <ul class="deck-list">
        <li
            class="deck-card commander"
        >
          <app-mtg-card-header
              :card="deck.getPrimaryCard()!"
              has-crown
          >
            <template #details="{card}">
              <div class="deck-details">
                <span class="cards-count">
                  <span class="count">{{ DeckCards.length }}</span>
                   <span class="total">100</span>
                </span>
              </div>
            </template>
          </app-mtg-card-header>
        </li>
        <template v-for="(card, index) in DeckCards" :key="`deck-card-${card.getId()}`">
          <li
              class="deck-card"
              :class="{'commander': deck.getPrimaryCard()?.getId() == card.getId()}"
          >
            <app-mtg-card-header :card="card" />
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>