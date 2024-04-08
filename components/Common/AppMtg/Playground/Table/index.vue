<script setup lang="ts">

import {HashedCardType} from "~/composables/customTypes/GameSessionType";
import {CardType} from "~/composables/entity/CardInterface";

const globalState = useGlobalState();

const emit = defineEmits(['magic-played']);

const props = withDefaults(
    defineProps<{
      deck:HashedCardType[],
      battlefield:CardType[]
    }>(), {

    }
);

const setActiveDragDrawer = () => {
  if (globalState.value.draggableElement) {
    emit('magic-played', globalState.value.draggableElement);
  }
}
</script>

<template>
  <div class="app-mtg-playground-table">
    <div
        class="playmat"
        @mouseenter="setActiveDragDrawer()"
    >
      <div class="battlefield">
        <pre>{{ battlefield }}</pre>
      </div>

      <div class="library-holder">
        <app-mtg-library
            :cards="deck"
            :deck-size="20"
            no-drop-zones
            :show-first-card="false"
            vertical-perspective="bottom"
            horizontal-perspective="left"
            :vertical-perspective-modifier=".6"
            :horizontal-perspective-modifier=".2"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.app-mtg-playground-table {
  position: absolute;
  top: 0;
  left: 50%;
  width: 90%;
  height: 200vh;
  box-shadow: 0 40px 24px #220;
  border-radius: 12px;
  background: url("~/assets/images/backgrounds/table-top-01.jpg");
  transform: translateX(-50%) translateY(-32%) rotateZ(0deg) rotateX(63deg);

  --playmat-width: 1200px;
  & > .playmat {
    position: absolute;
    bottom: 12px;
    left: 50%;
    transform: translateX(-50%);
    width: var(--playmat-width);
    height: calc(var(--playmat-width) * .583);
    background-image: url("~/assets/images/playmats/jace-001.webp");
    background-repeat: no-repeat;
    background-size: 100%;
    backdrop-filter: saturate(1);

    & > .library-holder {
      position: absolute;
      bottom: 0;
      right: 2px;
      width: 60px;
    }

    & > .battlefield {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      width: calc(100% - 120px);
      background-color: #0009;
    }
  }
}
</style>