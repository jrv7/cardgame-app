<script setup lang="ts">

import {CardInterface} from "~/composables/entity/CardInterface";
import {CollectionSet} from "~/composables/entity/CollectionSet";

const props = withDefaults(
    defineProps<{
      card:CardInterface,
      activeSet?:CollectionSet|null
    }>(),
    {
      activeSet: null
    }
);

</script>

<template>
  <div class="app-mtg-card--static">
    <app-mtg-card
        :card="card"
        :active-set="activeSet"
    />
  </div>
</template>