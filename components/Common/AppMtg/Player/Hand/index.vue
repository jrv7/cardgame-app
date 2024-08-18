<script setup lang="ts">

import {SessionControllerClass} from "~/composables/entity/Controller/SessionControllerClass";

const gameState = useGameState();
const props = withDefaults(
    defineProps<{
      session:Ref<SessionControllerClass>
    }>(), {

    }
);

const Session:Ref<SessionControllerClass> = computed(() => props.session) as Ref<SessionControllerClass>;

const HandCards = computed(() => {
  return Session.value?.Player?.Hand?.cards ?? [];
})
</script>

<template>
  <div class="app-mtg-player-hand-card-holder">
    <ul class="hand">
      <template v-for="(card, cIndex) in HandCards">
        <li class="card">
          <div class="card-holder">
            <app-mtg-card
                :card="card.card"
                hide-action
                hide-descriptions
            />
          </div>
        </li>
      </template>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.app-mtg-player-hand-card-holder {
  position: relative;
  display: flex;
  flex-flow: nowrap;
  max-width: 100%;

  & > ul.hand {
    position: relative;
    display: flex;
    flex-flow: nowrap;
    width: 400px;
    max-width: 400px;
    transition: all .3s ease-in-out;

    &:hover {
      width: 100%;
      max-width: 100%;
    }

    & > li {
      position: relative;
      display: flex;
      min-width: 64px;
      transition: all .3s ease-in-out;
      padding-top: 64px;
      z-index: 1;

      & > .card-holder {
        position: relative;
        display: flex;
        bottom: 0;
        width: 180px;
        transition: all .3s ease-in-out;
      }

      &:hover {
        z-index: 10;
        & > .card-holder {
          bottom: 48px;
        }
      }
    }
  }
}
</style>