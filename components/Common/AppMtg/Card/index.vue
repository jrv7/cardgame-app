<script setup lang="ts">
import {CardInterface} from "~/composables/entity/CardInterface";
import {CollectionSet} from "~/composables/entity/CollectionSet";
import {ImageCollection} from "~/composables/entity/ImageCollection";
import fallbackImageUrl from '~/assets/images/backgrounds/mtg-card-default-background.png'

const emit = defineEmits(['click']);

const props = withDefaults(
    defineProps<{
      card:CardInterface,
      activeSet?:CollectionSet|null,
      hideDescriptions?:boolean
    }>(),
    {
      activeSet: null,
      hideDescriptions: false
    }
);
const ready = ref(false);

const setImages:any = ref([]) as any;

const parseCardImage = computed(() => {
  if (!props.card?.getImageUrl()) {
    return '~/assets/images/backgrounds/mtg-card-default-background.png';
  }
  if (null !== props.activeSet) {
    const cardSetImage = props.card.getImageCollection().find(i => i.getCollectionSet().getId() === props.activeSet?.getId());
    if (cardSetImage) {
      return cardSetImage.getCollectionImage();
    }
  }
  // else if (props.card?.getLatestImageUrl()) {
  //   return props.card?.getLatestImageUrl();
  // }

  return props.card.getImageUrl();
});

const handleClickOnCard = () => {
  emit('click');
}

onNuxtReady(async () => {
  await new Promise((resolve) => {
    ready.value = true;
  })
})
</script>

<template>
  <div
      v-if="ready"
      class="mtg-card"
      @click="handleClickOnCard()"
  >
    <div class="card-image">
      <img
          :src="parseCardImage"
          :alt="card.getName()"
          @error="$event.target.src=fallbackImageUrl"
      >
    </div>

    <ul class="card-details" v-if="!hideDescriptions">
      <li>
        <span class="value">{{ card.getName() }}</span>
      </li>
      <li>
        <span class="title">Mana cost:</span>
        <span class="value">{{ card.getCmc() }}</span>
      </li>
    </ul>
  </div>
</template>