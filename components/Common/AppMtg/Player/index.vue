<script setup lang="ts">
import {SessionControllerClass} from "~/composables/entity/Controller/SessionControllerClass";

const gameState = useGameState();
const ready = ref(false);
const props = withDefaults(
    defineProps<{
      session:Ref<SessionControllerClass>
    }>(), {

    }
);

const Session:Ref<SessionControllerClass> = computed(() => props.session) as Ref<SessionControllerClass>;

const isPlayerReady = computed(() => {
  return !!gameState.value?.Player?.readyToPlay || !!Session.value.Player?.readyToPlay;
})

const showMulliganScreen = ref(true);
const handleMulliganDone = async (result:boolean) => {
  if (result) {
    showMulliganScreen.value = false;
  } else {
    console.log('MULLIGAN ERROR');
  }
}
</script>

<template>
  <div
      class="app-mtg-player"
  >
    <app-mtg-player-top-bar :session="Session" />
    <app-mtg-player-mulligan
        v-if="!isPlayerReady && showMulliganScreen" :session="Session"
        @hand-kept="(result) => handleMulliganDone(result)"
    />
    <app-mtg-player-hud v-if="isPlayerReady" :session="Session">

      <template #cardHolder>
        <app-mtg-player-hand :session="Session" />
      </template>
    </app-mtg-player-hud>
  </div>
</template>

<style scoped lang="scss">
.app-mtg-player {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 4px solid #000;
  z-index: 100;
  background: url("@/assets/images/mtg/card-frames/crown/B.png");
  background-repeat: no-repeat;
  background-position: center -250px;
  background-size: calc(100% + 260px);
}
</style>