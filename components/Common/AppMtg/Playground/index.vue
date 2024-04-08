<script setup lang="ts">
import {GameSessionType, GameType} from "~/composables/customTypes/GameSessionType";

const ObserverRef = ref(null);
const globalState = useGlobalState();
const meCookie = useCookie('currentplayer');
const myPlayerId = computed(() => {
  return parseInt(meCookie.value!);
});
const gameCookie = useCookie('currentgame');

const props = withDefaults(
    defineProps<{
      game:GameType
    }>(), {

    }
);

const Session:GameSessionType|null = ref(null) as GameSessionType|null;
const parsedSession = computed({
  get: ():GameSessionType|null => {
    return Session.value;
  },
  set: (value:GameSessionType) => {
    Session.value = useNuxtApp().$deepClone(value);
  }
});

const Player = computed(() => {
  if (!Session.value) return null;
  return Session.value.players.find(pl => pl.player.id === myPlayerId.value);
});

const Commander = computed(() => {
  if (!Session.value) return null;
  return Session.value?.playersCommanders?.find(cmd => cmd.playerId === myPlayerId.value)?.commander ?? null;
});

const Hand = computed(() => {
  if (!Session.value) return [];
  return [...Session.value.playersHands.find(ph => ph.playerId === myPlayerId.value).hand, {card: Commander.value.id}];
});

const Library = computed(() => {
  if (!Session.value) return [];
  return Session.value.playersDecks.find(pLib => pLib.playerId === myPlayerId.value).deck;
});

const Battlefield = computed(() => {
  if (!Session.value) return [];
  return Session.value.playersTables.find(pLib => pLib.playerId === myPlayerId.value).table;
});

const ThePile = computed(() => {
  if (!Session.value) return [];
  return useNuxtApp().$deepClone(Session.value.thePile);
});

const handleMagicPlayed = async (cardHash:string) => {
  await useDynamicPost(`/session/${props.game.uid}/play/${myPlayerId.value}/${cardHash}`)
      .then((response) => {
        ObserverRef.value.Observe();
      })
}

onBeforeMount(async () => {
  await useDynamicPost(`/session/${props.game.uid}/prepare-playground/${myPlayerId.value}`);
})
</script>

<template>
  <div class="app-mtg-playground">
    <app-mtg-observer
        ref="ObserverRef"
        :game-uid="game.uid"
        v-model:session="parsedSession"
    >

      <app-mtg-playground-hand
          :key="`-player-hand-${Hand.map(hc => hc.card).join('-')}`"
          :hand="Hand"
      />

      <app-mtg-playground-table
          :deck="Library"
          :battlefield="Battlefield"
          @magic-played="handleMagicPlayed"
      />

      <div class="pile-holder" v-if="ThePile?.length">
        <app-mtg-playground-the-pile
            :pile="ThePile"
        />
      </div>

<!--      <ol-->
<!--          class="drag-container play-area"-->
<!--          @mouseenter="setActiveDragDrawer()"-->
<!--      ></ol>-->

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

  & > .app-mtg-playground-hand {
    z-index: 100;
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