<script setup lang="ts">
import {CardInterface} from "~/composables/entity/CardInterface";
import {CollectionSet} from "~/composables/entity/CollectionSet";
import {ImageCollection} from "~/composables/entity/ImageCollection";
import fallbackImageUrl from '~/assets/images/backgrounds/mtg-card-default-background.png'
import {CardClass} from "~/composables/entity/Class/CardClass";
import {CollectionSetClass} from "~/composables/entity/Class/CollectionSetClass";
const mtgState = useMtgState();
const emit = defineEmits(['click']);

const props = withDefaults(
    defineProps<{
      card:CardClass,
      activeSet?:CollectionSetClass|null,
      hideAction?:boolean,
      hideDescriptions?:boolean,
      square?:boolean,
    }>(),
    {
      activeSet: null,
      hideAction: false,
      hideDescriptions: false,
      square: false
    }
);
const ready = ref(false);

const setImages:any = ref([]) as any;

const showBacksideImage = ref(false);
const toggleBacksideImage = () => {
  showBacksideImage.value = !showBacksideImage.value;
}

const parseCardImage = computed(() => {
  if (!props.card?.imageUrl) {
    return '~/assets/images/backgrounds/mtg-card-default-background.png';
  }
  if (null !== props.activeSet) {
    const cardSetImage = props.card.imageCollection?.find(i => i.getCollectionSet().getId() === props.activeSet?.id);
    if (cardSetImage) {
      return cardSetImage.getCollectionImage();
    }
  }

  if (props.square) {
    return props.card.artImageUrl ?? props.card.imageUrl;
  }

  return showBacksideImage.value ? (props.card.backsideImageUrl ?? props.card.imageUrl) : props.card.imageUrl;
});

const fetchColorsFromArray = (arr:string[]) => {
  let costColors = [];
  arr.forEach(i => {
    const colorData = mtgState.value.scryfallSymbols.find(c => c.symbol === `{${i.replaceAll('{','').replaceAll('}','')}}`);

    if (colorData) {
      if (colorData.colors.length) {
        if (!costColors.find(d => d === colorData.symbol)) {
          costColors.push(colorData.symbol);
        }
      }
    }
  })

  return costColors;
}

const parsedColorFromCost = computed(() => {
  const cardCost = props.card.manaCost;
  if (!cardCost) return '-';

  let splitCost = cardCost.split('}{');
  let costColors = fetchColorsFromArray(splitCost);

  if (!costColors.length) {
    const identityCost = props.card.identityCost;
    if (identityCost) {
      let splitIdentity = identityCost.split('}{');
      costColors = fetchColorsFromArray(splitIdentity);
    }
  }

  if (costColors.length === 1) {
    return costColors.map(i => i.replaceAll('{','').replaceAll('}','').replaceAll('/','')).join('');
  }

  if (costColors.length > 1) {
    let returnValue = [];

    if (costColors.length > 2) {
      returnValue.push('gold');
    }

    return [...returnValue, costColors.map(i => i.replaceAll('{','').replaceAll('}','').replaceAll('/','')).join('')].join('-');
  }

  if (props.card.type?.toLowerCase().includes('artifact')) {
    return 'artifact';
  } else {
    return 'colorless';
  }
});

const parseCardFrame = computed(() => {
  const cardColors = parsedColorFromCost.value;
  switch (cardColors) {
    case 'colorless': return import('~/assets/images/mtg/card-frames/creature/text-box-colorless.png');
    case 'artifact': return '~/assets/images/mtg/card-frames/creature/text-box-artifact.png';
    case 'W': return import('~/assets/images/mtg/card-frames/creature/text-box-white.png');
    case 'U': return '~/assets/images/mtg/card-frames/creature/text-box-blue.png';
    case 'B': return '~/assets/images/mtg/card-frames/creature/text-box-black.png';
    case 'R': return '~/assets/images/mtg/card-frames/creature/text-box-red.png';
    case 'G': return '~/assets/images/mtg/card-frames/creature/text-box-green.png';
    case 'WU': return import('~/assets/images/mtg/card-frames/creature/text-box-gold-WU.png');
    case 'WB': return '~/assets/images/mtg/card-frames/creature/text-box-gold-WB.png';
    default: return '~/assets/images/mtg/card-frames/creature/text-box-gold.png';
  }
});

const parseImageBase64 = computed(async () => {
  console.log('Getting img blob');
})

const handleClickOnCard = () => {
  emit('click');
}

const alterationsTrigger:any = ref(null);
const keepAlterations = () => {
  clearTimeout(alterationsTrigger.value);
  alterationsTrigger.value = null;
}
const disableAlterations = () => {
  alterationsTrigger.value = setTimeout(() => {
    showBacksideImage.value = false
    clearTimeout(alterationsTrigger.value);
    alterationsTrigger.value = null;
  }, 1000)
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
      :class="[{'square': square}, `card-color-${parsedColorFromCost}`]"
      :style="{'background-image': `url(${parseCardImage})`}"
      @mouseenter="keepAlterations()"
      @mouseleave="disableAlterations()"
  >
    <div class="card-image">
      <img
          :src="parseCardImage"
          :alt="card.name"
          @error="$event.target.src=fallbackImageUrl"
      >
      <img
          v-if="card.backsideImageUrl"
          class="hidden-backside-image"
          :src="card.backsideImageUrl"
          :alt="card.name"
          @error="$event.target.src=fallbackImageUrl"
      >
    </div>

    <button
        v-if="card.backsideImageUrl"
        class="flip-button"
        @click="toggleBacksideImage()"
    >
      <fa-icon :icon="['fas', 'repeat']" />
    </button>

    <slot name="actions" :card="card" v-if="!hideAction">
      <div class="actions-slot">
        <app-button
            type="link"
            size="xs"
            @click="handleClickOnCard()"
        >
          <fa-icon :icon="['fas', 'magnifying-glass-plus']" />
        </app-button>
      </div>
    </slot>

    <slot name="indicator" :card="card"></slot>

    <template v-if="square">
      <div class="square-card">
        <div class="header">
          <img :src="parseCardFrame" alt="card-face-u">

          <span class="card-name">{{ card.name }}</span>
        </div>


        <div class="footer">
<!--          <img src="~/assets/images/mtg/card-frames/non-creature/text-box-gold.png" alt="card-face-u">-->

          <span class="card-type">{{ card.type }}</span>
        </div>
      </div>
    </template>

    <ul class="card-details" v-if="!hideDescriptions">
      <li>
        <span class="value">{{ card.name }}</span>
      </li>
      <li>
        <span class="title">Mana cost:</span>
        <span class="value">{{ card.cmc }}</span>
      </li>
    </ul>
  </div>
</template>