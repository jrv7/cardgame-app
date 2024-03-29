<script setup lang="ts">
import {DeckInterface} from "~/composables/entity/DeckInterface";

const emit = defineEmits(['click']);

const props = withDefaults(
    defineProps<{
      deck:DeckInterface,
      hideDescriptions?:boolean
    }>(),
    {
      activeSet: null,
      hideDescriptions: false
    }
);
const ready = ref(false);
const isOpen = ref(false);

const handleOpenClose = () => {
  isOpen.value = !isOpen.value;
}
</script>

<template>
  <div
      class="app-mtg--deck-box"
      :class="{'opened': isOpen}"
      @click="handleOpenClose()"
  >
    <div class="deck-cards">
      <div class="front-card">
        <template v-if="deck.getCoverCard()">

        </template>
        <app-mtg-card :card="deck.getCoverCard()!" hide-descriptions />
      </div>
      <div
          class="card-behind"
          v-for="n in 5" :key="n"
          :style="{
          'top': `-${n*3}px`,
          'left': `-${n*3}px`,
          'z-index': 10-n
        }"></div>
    </div>
  </div>
</template>