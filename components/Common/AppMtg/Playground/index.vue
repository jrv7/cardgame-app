<script setup lang="ts">
import {SessionControllerClass} from "~/composables/entity/Controller/SessionControllerClass";

const gameStore = useGame();
const gameState = useGameState();

const ObserverRef = ref(null);
const meCookie = useCookie('currentplayer');
const myPlayerId = computed(() => {
  return parseInt(meCookie.value!);
});
const ready = ref(false);

const SessionController:Ref<SessionControllerClass> = ref(new SessionControllerClass(gameState)) as Ref<SessionControllerClass>;

const awaitFetchSession = async () => {
  setTimeout(() => {
    if (gameState.value.started && gameState.value.Session) {
      useApiPost(`/session/${gameState.value.Session.uid}/prepare-playground`)
          .then(({success, data}:{success:boolean, data:any}) => {
            SessionController.value.init(data)
                .then(() => {
                  setTimeout(() => {
                    ready.value = true;
                  }, 400)
                })
          })
    } else {
      awaitFetchSession();
    }
  }, 100)
}

onMounted(async () => {
  await awaitFetchSession();
})
</script>

<template>
  <div
      v-if="ready"
      class="app-mtg-playground"
  >
    <app-mtg-observer
        ref="ObserverRef"
        :game-uid="SessionController.Session.uid"
    >

      <app-mtg-playground-table :session="SessionController" />

      <app-mtg-player :session="SessionController" />

<!--      <div class="pile-holder" v-if="ThePile?.length">-->
<!--        <app-mtg-playground-the-pile-->
<!--            :pile="ThePile"-->
<!--        />-->
<!--      </div>-->

    </app-mtg-observer>
  </div>
</template>

<style lang="scss">
.app-mtg-playground {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  perspective: 3000px;
  transform-style: preserve-3d;

  & > .app-mtg-playground-table {
    z-index: 1;
  }

  & > .drag-container.play-area {
    position: absolute;
    bottom: -100px;
    left: 64px;
    width: calc(100% - 280px);
    height: 800px;
    transform: rotateX(63deg);
    background-color: #0009;
    z-index: 10;
  }

  & > .pile-holder {
    position: absolute;
    top: 32px;
    right: 12px;
    width: 240px;
    padding-top: 32px;
    z-index: 90;
  }
}
</style>