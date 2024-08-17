<script setup lang="ts">

import {SessionControllerClass} from "~/composables/entity/Controller/SessionControllerClass";
import {GamePlayerControllerClass} from "~/composables/entity/Controller/GamePlayerControllerClass";

const playerMulligans = useCookie('mulligans');
const props = withDefaults(
    defineProps<{
      session:Ref<SessionControllerClass>
    }>(), {

    }
);

const Session:Ref<SessionControllerClass> = computed(() => props.session) as Ref<SessionControllerClass>;

const parseMulligan = computed(() => {
  return parseInt(playerMulligans.value ?? '0');
})
const unHashCard = (cardHash:string):number => {
  const idLen = parseInt(cardHash.substr(7, 2));
  return parseInt(cardHash.substr((cardHash.length - (2 * idLen)), idLen));
}

onMounted(async () => {
  await Session.value.Player.shuffle();
})
</script>

<template>
  <div
      class="app-mtg-player-mulligan"
  >
    <div class="top">
      Drawing the first hand...
    </div>
    <div class="center">

    </div>
    <div class="bottom">bottom</div>
  </div>
</template>

<style scoped lang="scss">
.app-mtg-player-mulligan {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #000e;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  overflow: auto;
}
</style>