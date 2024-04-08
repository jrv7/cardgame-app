<script setup lang="ts">

import {GameSessionPileType} from "~/composables/customTypes/GameSessionType";
const props = withDefaults(
    defineProps<{
      pile:GameSessionPileType[]
    }>(), {

    }
);

const counter = ref(100);
const defaultDelay = ref(5000);
const delayStep = ref(1);
const currentDelay = ref(0);
const delayTrigger:any = ref(null) as any;

const parsedPile = computed(() => {
  if (!props.pile?.length) return [];
  const currentPile = useNuxtApp().$deepClone(props.pile);
  let inversePile = [];
  currentPile.forEach(i => {
    inversePile = [i, ...inversePile];
  })

  return inversePile;
});

onNuxtReady(() => {
  setTimeout(() => {
    delayTrigger.value = setInterval(() => {
      currentDelay.value = currentDelay.value + delayStep.value;

      let inTime = (currentDelay.value/defaultDelay.value);
      counter.value = (counter.value - inTime);

      if (inTime >= 1) {
        clearInterval(delayTrigger.value);
        delayTrigger.value = null;
      }
    }, delayStep.value)
  }, 2000)
})
</script>

<template>
  <div class="app-mtg-playground-the-pile">
    <div
        class="counter-cover"
        :style="{'width': `${counter}%`}"
    />

    <ul class="pile-spells">
      <template v-for="(spell, pIndex) in parsedPile" :key="`pile-spell-${pIndex}`">
        <li :style="{'scale': `${1 - ((parsedPile.length - pIndex) * .045)}`}">
          <app-mtg-card-id-holder
              :card-id="spell.spell.id"
              hide-action
          />
        </li>
      </template>
    </ul>
  </div>
</template>

<style lang="scss">
@import "@/assets/scss/_variables.scss";
@import "@/assets/scss/_mixins.scss";

.app-mtg-playground-the-pile {
  position: relative;
  display: flex;
  flex-direction: column;
  width: calc(100% - 24px);
  height: 80vh;
  min-height: 80vh;
  max-height: 80vh;
  overflow-y: auto;
  background-color: #0004;
  border-radius: 4px;
  border: 1px solid #0009;
  box-shadow: 0 0 12px #0009;
  padding: 12px;
  @include no-scrollbars();

  & > .counter-cover {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #0002;
    z-index: 10;
  }

  & > .pile-spells {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    z-index: 1;

    & > li {
      position: relative;
      display: flex;
      width: 100%;
      height: 48px;
      min-height: 48px;
      max-height: 48px;
      filter: saturate(.3);

      &:last-of-type {
        filter: saturate(1);
      }

      & > .app-mtg-card-id-holder {
        width: 100%;
      }
    }
  }
}
</style>