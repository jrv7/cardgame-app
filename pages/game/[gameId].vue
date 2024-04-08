<script setup lang="ts">

definePageMeta({
  layout: 'session'
});

const meCookie = useCookie('currentplayer');
const gameCookie = useCookie('currentgame');
const route = useRoute();
const gameId = computed(() => {
  return route.params.gameId
});

const ready = ref(false);

const Game:{}|null = ref(null) as {}|null;
const Player = ref(null);
const playerHandReady = ref(false);

const handleHandKept = async () => {
  await fetchGameSession();
}

const fetchGameSession = async () => {
  return new Promise((resolve, reject) => {
    useDynamicPost(`/session/${gameId.value}`)
        .then((session) => {
          Game.value = session;

          const playerData = session.players.find(i => i.player.id === parseInt(meCookie.value)).player;
          Player.value = playerData;

          const playerHand = session.playersHands?.find(i => i.playerId === playerData.id);
          const playerDeck = session.playersDecks?.find(i => i.playerId === playerData.id);

          if (playerHand?.hand?.length && playerDeck?.deck?.length) {
            playerHandReady.value = true;
          }

          resolve(session);
        })
  })
}

onBeforeMount(async () => {
  await fetchGameSession()
      .then(() => {
        ready.value = true;
      })
});
</script>

<template>
  <div class="app-mtg-game" v-if="ready">
    <app-mtg-game-draw
        v-if="!playerHandReady"
        :game="Game"
        :player="Player"
        @hand-kept="handleHandKept()"
    />

    <app-mtg-playground
        v-else
        :game="Game"
        :player="Player"
    />
  </div>
</template>