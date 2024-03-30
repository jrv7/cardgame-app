<script setup lang="ts">

import {DeckController} from "~/composables/controller/DeckController";

const emit = defineEmits(['set-modal-background']);

const props = withDefaults(
    defineProps< {
      deck : any,
    }>(), {
    });

const DController = new DeckController(props.deck);
const isLoading:any = ref(null) as any;
const ready = ref(false);

onNuxtReady(async () => {
  await DController.fetchMeta()
      .then(() => {
        ready.value = true;
        isLoading.value = setTimeout(() => {
          clearTimeout(isLoading.value);
          isLoading.value = null;
        }, 400);
      });
})

const parseModalValue = async () => {
  return new Promise((resolve) => {
    resolve(props.deck);
  });
}

defineExpose({ parseModalValue });
</script>

<template>
  <div class="app-subpage--deck-details" v-if="ready">
    <app-mtg-deck-box
        :deck="deck"
    />
  </div>
</template>