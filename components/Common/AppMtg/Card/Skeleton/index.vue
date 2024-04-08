<script setup lang="ts">
const props = withDefaults(
    defineProps<{
      noOpacity?:boolean
    }>(), {
      noOpacity: false
    }
);
</script>

<template>
  <div
      class="mtg-card skeleton"
      :class="{'no-opacity': noOpacity}"
      :style="{'background-image': `url(~/assets/images/backgrounds/mtg-card-default-background-standard.png)`}"
  >
    <div class="card-image">
      <!-- src="~/assets/images/backgrounds/mtg-card-default-background-standard.png" -->
      <img
          src="~/assets/images/card-sleeves/Werewolf-Luna__46859.webp"
          alt="skeleton"
      >
    </div>
  </div>
</template>