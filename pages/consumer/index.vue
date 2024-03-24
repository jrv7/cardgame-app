<script setup lang="ts">

const page = ref(1);
const parsePageNumber = computed({
  get: () => {
    return page.value;
  },
  set: (value:number) => {
    const fetchPageCookie = useCookie('fetchpagenumber') ?? 1;
    page.value = value;
    fetchPageCookie.value = `${value}`;
  }
});

const cardsFetched = ref(0);
const fetchAllCards = async () => {
  return new Promise(() => {
    useDynamicPost('/cards/fetch-all', {page: parsePageNumber.value, limit: 1})
        .then((response) => {
          if (response.success) {
            parsePageNumber.value = (response.data.page + 1);
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
  await new Promise((resolve) => {
    const fetchPageCookie = useCookie('fetchpagenumber') ?? 1;
    console.log('Page number loaded from cookies:', fetchPageCookie.value);
    page.value = parseInt(fetchPageCookie.value!);
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
  </div>
</template>