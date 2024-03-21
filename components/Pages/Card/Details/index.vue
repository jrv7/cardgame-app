<script setup lang="ts">

const props = withDefaults(
    defineProps< {
      card : any,
    }>(), {
    })
</script>

<template>
  <div class="app-subpage--card-details">
    <span>card</span>
    <img class="app-mtg-card default" v-if="card.imageUrl" :src="card.imageUrl" :alt="card.name">
    <pre>{{ card }}</pre>
  </div>
</template>