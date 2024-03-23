<script setup lang="ts">

const page = ref(1);
const cardsFetched = ref(0);
const fetchAllCards = async () => {
  return new Promise(() => {
    useDynamicPost('/cards/fetch-all', {page: page.value, limit: 1})
        .then((response) => {
          if (response.success) {
            page.value = (response.data.page + 1);
            cardsFetched.value = (cardsFetched.value + response.data?.cards);

            setTimeout(() => {
              fetchAllCards();
            }, 1000);
          } else if (response.code !== 404) {
            setTimeout(() => {
              fetchAllCards();
            }, (60 * (60 * 1000)));
          }
        })
  })
}

onNuxtReady(async () => {
  await fetchAllCards();
})
</script>

<template>
  <div class="app-page--consumer">
    <p>Consumer page: {{ page }}</p>
    <p>Cards fetched: {{ cardsFetched }}</p>
  </div>
</template>