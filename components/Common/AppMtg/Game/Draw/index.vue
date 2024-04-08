<script setup lang="ts">
const playerMulligans = useCookie('mulligans');
const emit = defineEmits(['hand-kept']);
const props = withDefaults(
    defineProps<{
      game:{},
      player:{},
    }>(), {
    }
);
const MAX_MULLIGANS = ref(4);
const loading = ref(false);
const hoveredCard:any = ref(null) as any;
const returningToLibrary = ref(false);
const parseMulligan = computed(() => {
  return parseInt(playerMulligans.value);
})
const Deck:{position:number, card:srting}[] = ref([]) as {position:number, card:srting}[];
const OriginalDeck:{position:number, card:srting}[] = ref([]) as {position:number, card:srting}[];
const cardsToKeep = ref(7);
const validHand = computed(() => {
  if (playerMulligans.value <= 1) return true;
  return (parsedFirstHand.value.length <= cardsToKeep.value);
});
const unHashCard = (cardHash:string):number => {
  const idLen = parseInt(cardHash.substr(7, 2));
  return parseInt(cardHash.substr((cardHash.length - (2 * idLen)), idLen));
}
const parsedFirstHand = computed(() => {
  if (Deck.value?.length) {
    let cards = [];

    for(let i = 6; i >= 0; i--) {
      const currentCard = Deck.value.find(j => j.position === i);
      if (currentCard) {
        cards.push(currentCard);
      }
    }

    return cards;
  }
  return [];
});

const fetchShuffle = async () => {
  return new Promise((resolve, reject) => {
    useDynamicPost(`/session/${props.game.uid}/first-hand/${props.player.id}`, {mulligans: playerMulligans.value})
        .then((firstHand) => {
          const deckCards = firstHand.data.map(i => {
            return {
              position: i.position,
              cardHash: i.card,
              card: unHashCard(i.card)
            }
          });
          Deck.value = useNuxtApp().$deepClone(deckCards);
          OriginalDeck.value = useNuxtApp().$deepClone(deckCards);
          resolve(firstHand);
        })
  })
}

const handleMulligan = async () => {
  loading.value = true;
  playerMulligans.value = (playerMulligans.value + 1);
  cardsToKeep.value--;

  await fetchShuffle()
      .then(() => {
        setTimeout(() => {
          loading.value = false;
        }, 1000)
      })
}

const handleKeepHand = async () => {
  return new Promise((resolve, reject) => {
    if (!returningToLibrary.value && cardsToKeep.value !== 7) {
      returningToLibrary.value = true;
      resolve(true);
    } else {
      const playerHand = useNuxtApp().$deepClone(parsedFirstHand.value);
      Deck.value = Deck.value.filter(i => !playerHand.map(j => j.cardHash).includes(i.cardHash));
      useDynamicPost(`/session/${props.game.uid}/keep-hand/${props.player.id}`, {hand: playerHand, deck: Deck.value})
          .then(() => {
            playerMulligans.value = null;
            emit('hand-kept', true);
          })
          .catch(() => {
            console.error('Could not keep hand...');
          })
    }
  })
}

const handleReturnCard = (cardHash) => {
  if (validHand.value) return;
  let card = Deck.value.find(i => i.cardHash === cardHash);
  if (card) {
    card.position = (Deck.value[Deck.value.length - 1].position + 1);
    Deck.value = [...Deck.value.filter(i => i.cardHash !== card.cardHash), card];
  }
}

const undoReturnedCards = () => {
  Deck.value = useNuxtApp().$deepClone(OriginalDeck.value);
}

const setHoveredCard = (cardHash) => {
  clearTimeout(hoverTrigger.value);
  hoverTrigger.value = null;
  hoveredCard.value = cardHash;
}
const hoverTrigger:any = ref(null) as any;
const unsetHoveredCard = () => {
  hoverTrigger.value = setTimeout(() => {
    hoveredCard.value = null;
    clearTimeout(hoverTrigger.value);
    hoverTrigger.value = null;
  }, 400)
}

onBeforeMount(async () => {
  if (null === playerMulligans.value || undefined === playerMulligans.value) {
    playerMulligans.value = 0;
  }

  if (playerMulligans.value > 1) {
    if ((playerMulligans.value - 1) >= 6) {
      cardsToKeep.value = 1;
    } else {
      cardsToKeep.value = (7 - (playerMulligans.value - 1));
    }
  }

  await fetchShuffle();
})
</script>

<template>
  <div class="app-mtg-game--draw">
    <div class="card-drawer" :class="{'show-library': returningToLibrary}">

      <div class="deck-drawer">
        <app-mtg-library
            :cards="Deck.filter(i => i.position >= 7)"
            :allow-drag-to-top="false"
            @dragged-to-bottom="handleReturnCard"
        />
      </div>

      <ul class="cards-carousel" :key="`hand-${parsedFirstHand.map(i => i.card).join('_')}`">
        <template v-for="(card, index) in parsedFirstHand" :key="`-card-list-${index}`">
          <li
              :style="{'z-index': (10 + index)}"
              :class="{'hovered': hoveredCard === card.cardHash}"
              @mouseenter.self="setHoveredCard(card.cardHash)"
              @mouseleave.self="unsetHoveredCard(card.cardHash)"
          >
            <app-mtg-card-id-holder
                :card-id="card.card"
                :draggable-item-id="card.cardHash"
                hide-action
                v-drag-able
            />
          </li>
        </template>
      </ul>
    </div>

    <div class="mulligan-choices">
      <span
          v-if="playerMulligans > 1 && !returningToLibrary && (MAX_MULLIGANS - (playerMulligans - 1))"
          class="mulligans-left-alert"
      >You can mulligan {{ MAX_MULLIGANS - (playerMulligans - 1) }} more times</span>
      <span
          v-if="playerMulligans > 1 && (parsedFirstHand.length - cardsToKeep)"
          class="return-alert"
      >You will have to return {{ parsedFirstHand.length - cardsToKeep }} card{{ (playerMulligans - 1) > 1 ? 's' : '' }} to the bottom of your library</span>
      <ul class="mulligan-choice-options">
        <li
            v-if="!returningToLibrary && (MAX_MULLIGANS - (playerMulligans - 1))"
        >
          <app-button
              type="primary"
              size="sm"
              class="max-width"
              :disabled="loading"
              @click="handleMulligan()"
          >
            {{ !parseMulligan ? ('Free') : '' }} mulligan
          </app-button>
        </li>
        <li>
          <app-button
              :type="(!returningToLibrary || !validHand) ? 'secondary' : 'primary'"
              size="sm"
              class="max-width"
              :disabled="loading || (returningToLibrary && !validHand)"
              @click="handleKeepHand()"
          >
            Keep hand ({{ cardsToKeep }} cards)
          </app-button>
        </li>
        <li
            v-if="returningToLibrary"
        >
          <app-button
              type="danger"
              size="sm"
              class="max-width"
              :disabled="loading"
              @click="undoReturnedCards()"
          >
            Undo
          </app-button>
        </li>
      </ul>
    </div>
  </div>
</template>