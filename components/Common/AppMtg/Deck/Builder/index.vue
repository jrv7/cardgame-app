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
const DeckCards: { card: CardInterface, quantity: number }[] = ref([]) as { card: CardInterface, quantity: number }[];
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

const parsedDeckLength = computed(() => {
  let countCards = 1;

  DeckCards.value.forEach((dCard:any) => {
    countCards += (dCard.quantity ?? 1);
  })
  return countCards;
})

const defaultColors = computed(() => {
  return mtgState.value.colors;
});

const cardInDeck = (card) => {
  return !!DeckCards.value.find(i => i.card.getId() === card.getId());
}

const addCardToDeck = async  (card:CardInterface) => {
  await useDynamicPost(`/decks/${props.deck.getId()}/cards/add`, {cardId: card.getId()})
      .then((addResp) => {
        fetchDeckList()
      })
}

const removeCardFromDeck = async  (card:CardInterface) => {
  await useDynamicPost(`/decks/${props.deck.getId()}/cards/remove/${card.getId()}`, {})
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
                return {
                  card: new Card(i.card),
                  quantity: i.quantity
                }
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
          :deck="deck"
          :list-size="8"
          :page-size="24"
          class="margin-top-12"
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
                  type="danger"
                  size="xs"
                  @click="removeCardFromDeck(card)"
              >
                <fa-icon :icon="['fas', 'minus']" />
              </app-button>
            </li>
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
                  <span class="count">{{ parsedDeckLength }}</span>
                   <span class="total">100</span>
                </span>
              </div>
            </template>
          </app-mtg-card-header>
        </li>
        <template v-for="(deckCard, index) in DeckCards" :key="`deck-card-${deckCard.card.getId()}`">
          <li
              class="deck-card"
              :class="{'commander': deck.getPrimaryCard()?.getId() == deckCard.card.getId()}"
          >
            <app-mtg-card-header :card="deckCard.card" :quantity="deckCard.quantity" />
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>