<script setup lang="ts">
import {oGame} from "~/composables/entity/Interface/GameInterface";
import {oGamePlayer} from "~/composables/entity/Interface/GamePlayerInterface";

const gameStore = useGame();
const gameState = useGameState()
definePageMeta({
  layout: 'session'
});
const route = useRoute();
const gameId = computed(() => { return route.params.gameId; });
const playerUid:Ref<string> = computed(() => { return route.params.playerUid; }) as Ref<string>;
const ready = ref(false);

const fetchGameSession = async () => {
  return new Promise((resolve, reject) => {
    useApiPost(`/session/${gameId.value}`)
        .then((session) => {
          resolve(session);
        })
  })
}

onBeforeMount(async () => {
  await fetchGameSession()
      .then(({success, data}:{success:boolean, data:{game:oGame, players:oGamePlayer[]}}) => {
        gameStore.setSession(data);
        gameStore.setPlayerUid(playerUid.value)
      })
});

onMounted(async () => {
  setTimeout(() => {
    gameStore.start();
  }, 1000)
})
</script>

<template>
  <div class="app-mtg-game" v-if="gameState.started">
    <app-mtg-playground />
  </div>
</template>