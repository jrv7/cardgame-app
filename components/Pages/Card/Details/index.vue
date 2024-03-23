<script setup lang="ts">

import {CardInterface} from "~/composables/entity/CardInterface";

const props = withDefaults(
    defineProps< {
      card : any,
    }>(), {
    });

const cardMeta:CardInterface|null = ref(null) as CardInterface|null;

const isLoading:any = ref(null) as any;

const ready = ref(false);

const changeCollectionSet = async (set) => {
  isLoading.value = true;

  await new Promise((resolve) => {
    console.log('Changing set', set);

    setTimeout(() => {
      resolve();
    }, 1000);
  })
      .then(() => {
        isLoading.value = setTimeout(() => {
          clearTimeout(isLoading.value);
          isLoading.value = null;
        }, 300)
      })
}

onNuxtReady(async () => {
  await new Promise((resolve) => {
    isLoading.value = true;
    cardMeta.value = props.card.fetchMeta();
    resolve();
  })
      .then(() => {
        ready.value = true;
        isLoading.value = setTimeout(() => {
          clearTimeout(isLoading.value);
          isLoading.value = null;
        }, 400);
      })
})
</script>

<template>
  <div class="app-subpage--card-details" v-if="ready">
    <img class="app-mtg-card default" v-if="card.imageUrl" :src="card.imageUrl" :alt="card.name">
    <ul class="collection-sets-list">
      <template v-for="(set, index) in card.getCollectionSets()" :key="`car-collection-set-item-${index}`">
        <li>
          <app-mtg-set-symbol
              v-if="set.getCode() !== null"
              :value="set.getCode()"
              :rarity="set.getId() === card.getCollectionSet().getId() ? 'mythic' : 'uncommon'"
              :name="set.getName()"
              :loading="!!isLoading"
              can-hover
              @click="changeCollectionSet(set)"
          />
          <span v-else>-</span>
        </li>
      </template>
    </ul>
  </div>
</template>