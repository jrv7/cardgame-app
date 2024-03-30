<script setup lang="ts">
import {Deck} from "~/composables/entity/Deck";
import {DeckInterface} from "~/composables/entity/DeckInterface";
import {DeckController} from "~/composables/controller/DeckController";

definePageMeta({
  layout: 'deckbuilder'
});
const route = useRoute();
const deckId = computed(() => { return parseInt(route.params.deckId) });
let deck:DeckInterface|null = null;
let CDeck;

const ready = ref(false);

onNuxtReady(async () => {
  await useDynamicPost(`/decks/${deckId.value}`)
    .then(({data}:DeckInterface) => {
      CDeck = new DeckController(new Deck(data));

      setTimeout(() => {
        ready.value = true;
      }, 1000);
    })
})
</script>

<template>
  <div
      v-if="ready"
      class="app-page--deck-editor"
  >

    <!-- Background table -->
    <div class="play-table">

      <div class="table-top">
        <div class="ground-element">

          <div class="floating-content">
            <app-mtg-card
                :card="CDeck.getDeck().getCoverCard()"
                hide-descriptions
            />
          </div>
        </div>
      </div>
    </div>

    <!-- User hand -->
    <div class="user-hand">
      <app-mtg-deck-builder :deck="CDeck.getDeck()" />
    </div>

    <!-- User hand -->
    <div class="front-screen">
      <span>front-screen</span>
    </div>
  </div>
</template>