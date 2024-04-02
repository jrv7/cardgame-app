<script setup lang="ts">
import {CardInterface} from "~/composables/entity/CardInterface";
import {CollectionSet} from "~/composables/entity/CollectionSet";
import {ImageCollection} from "~/composables/entity/ImageCollection";
import fallbackImageUrl from '~/assets/images/backgrounds/mtg-card-default-background.png'
const mtgState = useMtgState();
const emit = defineEmits(['click']);

const props = withDefaults(
    defineProps<{
      card:CardInterface,
      activeSet?:CollectionSet|null,
      hideDescriptions?:boolean,
      square?:boolean,
    }>(),
    {
      activeSet: null,
      hideDescriptions: false,
      square: false
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

  if (props.square) {
    return props.card.getArtImageUrl() ?? props.card.getImageUrl();
  }

  return props.card.getImageUrl();
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
  const cardCost = props.card.getManaCost();
  if (!cardCost) return '-';

  let splitCost = cardCost.split('}{');
  let costColors = fetchColorsFromArray(splitCost);

  if (!costColors.length) {
    const identityCost = props.card.getIdentityCost();
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

  if (props.card.getType()?.toLowerCase().includes('artifact')) {
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
  >
    <div class="card-image">
      <img
          :src="parseCardImage"
          :alt="card.getName()"
          @error="$event.target.src=fallbackImageUrl"
      >
    </div>

    <slot name="actions" :card="card">
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

          <span class="card-name">{{ card.getName() }}</span>
        </div>


        <div class="footer">
<!--          <img src="~/assets/images/mtg/card-frames/non-creature/text-box-gold.png" alt="card-face-u">-->

          <span class="card-type">{{ card.getType() }}</span>
        </div>
      </div>
    </template>

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