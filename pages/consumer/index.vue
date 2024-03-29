<script setup lang="ts">

const cardsFetched = ref(0);
const pageError = ref(false);
const fetchAllCards = async () => {
  return new Promise(() => {
    useDynamicPost('/cards/fetch-all-from-json', {limit: 10})
        .then((response) => {
          if (response.success) {
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
        .catch((e) => {
          pageError.value = true;
          console.log('Error:', e);
        })
  })
}

onNuxtReady(async () => {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, 200)
  })
      .then(() => {
        fetchAllCards();
      })
})
</script>

<template>
  <div class="app-page--consumer">
    <p>Consumer page: {{ page }}</p>
    <p>Cards fetched: {{ cardsFetched }}</p>
    <p v-if="pageError" style="color: var(--color-secondary-red)">Consumer page returned Error!</p>
  </div>
</template>