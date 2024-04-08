<script setup lang="ts">

import {CardController} from "~/composables/controller/CardController";
import {Card} from "~/composables/entity/Card";

const props = withDefaults(
    defineProps<{
      cardId:number,
      hideAction?:boolean
    }>(), {
      hideAction: false
    }
);
const ready = ref(false);

const CCard:CardController|null = new CardController();

onBeforeMount(async () => {
  await useDynamicPost(`/cards/${props.cardId}`)
      .then((cardResp) => {
        CCard.setCard(new Card(cardResp.data));
        ready.value = true;
      })
})
</script>

<template>
  <div
      v-if="ready"
      class="app-mtg-card-id-holder"
      :data-card-id="cardId"
  >
    <app-mtg-card
        :card="CCard.getCard()"
        hide-descriptions
        :hide-action="hideAction"
    />
  </div>
</template>