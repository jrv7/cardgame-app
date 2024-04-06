<script setup lang="ts">

definePageMeta({
  layout: 'game'
});

const route = useRoute();
const gameId = computed(() => {
  return route.params.gameId
});

const ready = ref(false);

const currentPlayer = ref(null);

onBeforeMount(async () => {

});
</script>

<template>
  <div class="app-mtg-game" v-if="ready">
    <span>Game here {{ gameId }}</span>
  </div>
</template>