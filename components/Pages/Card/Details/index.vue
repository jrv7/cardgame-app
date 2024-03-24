<script setup lang="ts">

import {CardInterface} from "~/composables/entity/CardInterface";
import {CardController} from "~/composables/controller/CardController";
import {CollectionSet} from "~/composables/entity/CollectionSet";

const props = withDefaults(
    defineProps< {
      card : any,
    }>(), {
    });

const CController = new CardController(props.card);
const isLoading:any = ref(null) as any;
const ready = ref(false);
const cardSets:any = ref([]) as any;
const activeSet:CollectionSet|null = ref(null) as CollectionSet|null;
const parseActiveSet = computed(() => {
  if (!activeSet.value || !ready.value) {
    return null;
  }

  return activeSet.value;
});

const uniqueSets = ref([]);

const parseCollectionSets = computed(() => {
  return CController.getCard().getImageCollection().filter(i => {
    const colSet = i.getCollectionSet();
    if (!uniqueSets.value.includes(colSet.getId())) {
      uniqueSets.value.push(colSet.getId());

      return colSet;
    }

    return false;
  }).map(i => i.getCollectionSet());
});
const changeCollectionSet = async (set) => {
  isLoading.value = true;

  await new Promise((resolve) => {
    activeSet.value = set;

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
  await CController.fetchMeta()
      .then(() => {
        ready.value = true;
        isLoading.value = setTimeout(() => {
          clearTimeout(isLoading.value);
          isLoading.value = null;
        }, 400);
      });
})
</script>

<template>
  <div class="app-subpage--card-details" v-if="ready">
    <app-mtg-card-static
        :card="CController.getCard()"
        :active-set="parseActiveSet"
    />

    <app-mtg-set-symbol-carousel
        :sets="parseCollectionSets"
        v-model="activeSet"
    />
  </div>
</template>