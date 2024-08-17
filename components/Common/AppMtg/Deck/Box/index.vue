<script setup lang="ts">
import {DeckClass} from "~/composables/entity/Class/DeckClass";

const emit = defineEmits(['click']);

const props = withDefaults(
    defineProps<{
      deck:DeckClass,
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
  emit('click', true);
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
        <template v-if="deck.coverCard">
          <app-mtg-card :card="deck.coverCard" hide-descriptions />
        </template>
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