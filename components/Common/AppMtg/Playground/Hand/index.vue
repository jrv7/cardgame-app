<script setup lang="ts">

import {GamePlayerHandType, HashedCardType} from "~/composables/customTypes/GameSessionType";

const props = withDefaults(
    defineProps<{
      hand:HashedCardType[]
    }>(), {

    }
);

const Hand = computed(() => {
  return props.hand ?? [];
});

const focusOnHand = ref(false);

const calcCardRotation = (cardPosition:number) => {
  const handSize = Hand.value.length;
  const hasMiddleCard = !!(handSize%2);
  const half = parseInt(handSize/2);
  const maxDeg = focusOnHand.value ? 25 : 12;
  const degParcel = maxDeg / half;

  if (hasMiddleCard && ((cardPosition + 1) === (half + 1))) {
    return '0';
  } else if ((cardPosition) < half) {
    return `-${((half - cardPosition) * degParcel)}`;
  } else {
    return `${((cardPosition - (half - 1)) * degParcel)}`;
  }

  return `${maxDeg}`;
}

const calcCardSkewDown = (cardPosition) => {
  const handSize = Hand.value.length;
  const hasMiddleCard = !!(handSize%2);
  const half = parseInt(handSize/2);
  const maxDeg = focusOnHand.value ? 120 : 52;
  const degParcel = maxDeg / half;

  if (hasMiddleCard && ((cardPosition + 1) === (half + 1))) {
    return '0';
  } else if ((cardPosition) < half) {
    return `${((half - cardPosition) * degParcel)}`;
  } else {
    return `${((cardPosition - (half - (hasMiddleCard ? 0 : 1))) * degParcel)}`;
  }

  return `${maxDeg}`;
}
</script>

<template>
  <div class="app-mtg-playground-hand">
    <ul
        class="hand-cards-list"
        :class="{'blurred': !focusOnHand}"
    >
      <template v-for="(card, cIndex) in Hand" :key="`hand-card-${cIndex}`">
        <li
            :style="{
              'width': `calc((100% / ${Hand.length}) - 12px)`,
              'transform': `translateY(calc(-80% + ${calcCardSkewDown(cIndex)}px)) rotateZ(${calcCardRotation(cIndex)}deg)`
            }"
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
</template>

<style lang="scss">
.app-mtg-playground-hand {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 32px;

  & > .hand-cards-list {
    position: absolute;
    display: flex;
    flex-flow: nowrap;
    bottom: 0;
    left: 40%;
    transform: translateX(-50%);
    width: fit-content;
    max-width: 70%;
    height: 1px;
    min-height: 1px;
    max-height: 1px;
    padding: 0;
    margin: 0;
    transition: all .3s ease-in-out;

    &.blurred {
      left: 10%;
      scale: .6;
    }

    --hand-card-size: 240px;

    & > li {
      position: relative;
      display: flex;
      transform: translateY(-80%) rotateZ(5deg);
      width: calc((100% / 7) - 12px);
      margin-right: 12px;
      height: calc(var(--hand-card-size) * 1.4);
      padding: 0;
      transition: all .3s ease-in-out;
      z-index: 10;

      &:hover {
        transform: translateY(-120%) !important;
        z-index: 200;
      }

      & > .app-mtg-card-id-holder {
        position: relative;
        display: flex;
        width: calc(var(--hand-card-size));
        min-width: calc(var(--hand-card-size));
        max-width: calc(var(--hand-card-size));
        height: calc(var(--hand-card-size) * 1.4);
        border-radius: 4px;
        overflow: hidden;
      }
    }
  }
}
</style>