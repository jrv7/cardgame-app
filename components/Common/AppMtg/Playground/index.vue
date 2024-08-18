<script setup lang="ts">
import {SessionControllerClass} from "~/composables/entity/Controller/SessionControllerClass";

const gameState = useGameState();
const ObserverRef = ref(null);
const meCookie = useCookie('currentplayer');
const myPlayerId = computed(() => {
  return parseInt(meCookie.value!);
});
const ready = ref(false);

const SessionController:Ref<SessionControllerClass> = ref(new SessionControllerClass()) as Ref<SessionControllerClass>;

const SessionUpdateTrigger:any = ref(null);
watch(gameState.value, async (newVal:any) => {
  clearTimeout(SessionUpdateTrigger.value)
  SessionUpdateTrigger.value = null;
  SessionUpdateTrigger.value = setTimeout(() => {
    SessionController.value.init(newVal.Session)
  }, 1500)
}, { deep: true, immediate: true })

const awaitFetchSession = async () => {
  setTimeout(() => {
    if (gameState.value.started && gameState.value.Session && myPlayerId.value) {
      useApiPost(`/session/${gameState.value.Session.uid}/prepare-playground`)
          .then(({success, data}:{success:boolean, data:any}) => {
            const sessionData = {
              ...data,
              Player: data.players?.find(p => p.player?.id === myPlayerId.value),
              ...{
                PlayerId: myPlayerId.value ?? null,
                PlayerUid: data.players?.find(p => p.player?.id === myPlayerId.value)?.player?.uid ?? null,
                readyToPlay: data.players?.find(p => p.player?.id === myPlayerId.value)?.readyToPlay ?? false,
              },
            };
            SessionController.value.init(sessionData)
                .then(() => {
                  SessionController.value.setGameState(sessionData);
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