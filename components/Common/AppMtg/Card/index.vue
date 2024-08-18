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
      visible?:boolean,
      clickable?:boolean
    }>(),
    {
      activeSet: null,
      hideAction: false,
      hideDescriptions: false,
      square: false,
      visible: true,
      clickable: false
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

const handleClick = () => {
  if (!props.clickable) return;
  emit('click', true);
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
      :class="[{'square': square, 'is-visible':visible, 'clickable': clickable}, `card-color-${parsedColorFromCost}`]"
      @mouseenter="keepAlterations()"
      @mouseleave="disableAlterations()"
      @click.self="handleClick()"
  >
    <div class="card-image">
      <img
          class="card-back"
          src="@/assets/images/backgrounds/mtg-card-default-background-standard.png"
          :alt="card.name"
          @error="$event.target.src=fallbackImageUrl"
          @click.self="handleClick()"
      >
      <img
          :src="parseCardImage"
          :alt="card.name"
          @error="$event.target.src=fallbackImageUrl"
          @click.self="handleClick()"
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

<style lang="scss">
@import "@/assets/scss/_variables.scss";
@import "@/assets/scss/_mixins.scss";



/* Card dimensions: (2.5in x 3.5in) or (6.35cm x 8.98cm) or (240px x 339.4px) */
.mtg-card {
  position: relative;
  display: flex;
  width: 0 !important;
  height: 0 !important;
  border-radius: 8px;
  z-index: 1;
  perspective: 1000px;
  background-image: url("@/assets/images/backgrounds/mtg-card-default-background-standard.png") !important;



  &.clickable {
    cursor: pointer !important;
  }

  &.skeleton {
    opacity: .6;
  }

  & > .flip-button {
    position: absolute;
    bottom: 32px;
    right: 0;
    // transform: translate(-50%, -50%);
    background-color: #ff9;
    border: none;
    border-top-left-radius: 8px;
    border-bottom-right-radius: 8px;
    width: 42px;
    height: 42px;
    opacity: .4;
    z-index: 100;
    transition: all .3s ease-in-out;
    cursor: pointer !important;
  }

  &:hover {
    & > .flip-button {
      opacity: .8;
    }
  }

  &.no-opacity {
    &.skeleton {
      opacity: 1;
    }
  }

  &:not(.square) {
    padding: calc((100% / 2) * 1.4) calc(100% / 2);

    & > .card-image {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100%;
      height: 100%;
      transform: translate(-50%, -50%) rotateY(0deg) !important;
      border-radius: 8px;
      overflow: hidden;
      transition: all .2s ease-in-out;
      background-color: #000 !important;
      background-image: url("@/assets/images/backgrounds/mtg-card-default-background-standard.png") !important;
      background-size: 100% !important;
      perspective: 1000px;
      z-index: 10;

      & > img,
      & > picture > img,
      & > object.image-fallback {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        width: calc(100% + 8px);
        z-index: 10;

        &.card-back {
          transform: translate(-50%, -50%) rotateY(0deg);
          transition: none !important;
          z-index: 1;
        }
      }

      & > .hidden-backside-image {
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        width: 1px;
        opacity: 0;
      }

      & > svg {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        width: calc(100% + 8px);
        background-color: #000;
      }
    }

    & > .actions-slot {
      position: absolute;
      top: 0;
      left: 0;
      padding: 24px;
      border-radius: 0 0 80px 0;
      background-color: #0004;
      transition: all .3s ease-in-out;
      opacity: 0;
      z-index: 10;
    }

    &:hover {
      & > .actions-slot {
        opacity: 1;
      }
    }
  }

  &:not(.is-visible) {
    & > .card-image {
      transform: translate(-50%, -50%) rotateY(180deg);

      & > img,
      & > picture > img,
      & > object.image-fallback {
        transform: translate(-100%, -50%, 12px) !important;
        &:not(.card-back) {
          opacity: 0;
        }
      }
    }
  }

  &.square {
    padding: calc((100% / 2) - 4px);
    overflow: hidden;
    z-index: 1;

    &:before {
      content: '';
      position: absolute;
      top: -1px;
      left: -1px;
      right: -1px;
      bottom: -1px;
      border: 6px solid var(--color-mtg-white);
      box-shadow: 0 0 24px -3px inset var(--color-mtg-white);
      z-index: 3;
    }

    & > .card-image {
      z-index: 2;

      & > img,
      & > picture > img,
      & > object.image-fallback {
        position: absolute;
        top: calc(50% + 24px);
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        height: calc(100% + 8px);
        background-color: #000;
      }

      &:after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #0000;
        box-shadow: 0 0 8px 4px inset #000;
      }
    }

    & > .square-card {
      position: absolute;
      top: 2px;
      left: 4px;
      width: calc(100% - 8px);
      height: 100%;
      z-index: 3;

      & > .header {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-top: 4px solid var(--color-mtg-white);
        z-index: 4;

        & > img {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          width: calc(100% + 28px);
          z-index: 5;
        }

        & > span.card-name {
          position: absolute;
          display: flex;
          top: 2px;
          left: 8px;
          width: calc(100% - 24px);
          z-index: 10;
          color: #000;
          font-size: calc(12px * .9);
        }
      }

      & > .footer {
        position: absolute;
        bottom: 0;
        left: -2px;
        width: calc(100% + 4px);
        height: calc(100% - 6px);
        z-index: 14;
        overflow: hidden;
        border-bottom: 15px solid var(--color-mtg-white);

        & > img {
          position: absolute;
          bottom: -12px;
          left: 50%;
          transform: translateX(-50%);
          width: calc(100% + 28px);
          z-index: 15;
        }

        & > span.card-type {
          position: absolute;
          display: flex;
          bottom: -1px;
          left: 8px;
          width: calc(100% - 24px);
          z-index: 20;
          color: #333;
          font-size: calc(12px * .9);
        }
      }
    }
  }

  & > .card-details {
    position: absolute;
    display: flex;
    flex-direction: column;
    top: 0;
    right: calc(100% + 12px);
    width: 320px;
    max-height: calc(100vh - 24px);
    min-height: 200px;
    padding: 0;
    background-color: #222224;
    border-radius: 8px;
    border: 1px solid #333;
    z-index: 100;

    &:before {
      content: '';
      position: absolute;
      top: 32px;
      right: -12px;
      width: 32px;
      height: 32px;
      background-color: #222224;
      transform: rotateZ(45deg);
      border: 1px solid #333;
      z-index: 1;
    }

    &:after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #222224;
      border-radius: 8px;
      z-index: 2;
    }

    & > li {
      position: relative;
      display: flex;
      flex-direction: column;
      width: 100%;
      padding: 4px 0;
      border-bottom: 1px solid #333;
      z-index: 10;

      & > span {
        position: relative;
        display: flex;
        padding: 0 12px;
      }
    }
  }
}

.app-mtg-card--static {
  position: relative;
  display: flex;
  width: 100%;
  max-width: 480px !important;
  margin: 0 auto;
}

.app-mtg-card-footer,
.app-mtg-card-header {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 40px;
  z-index: 1;

  &.has-crown {
    padding-top: 45px;
  }

  &:not(.small) {
    --size-adjustment: 1;
  }

  &.small {
    --size-adjustment: .8;
  }

  & > .decoration {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 64px;
    z-index: 2;

    &:before {
      content: '';
      position: absolute;
      top: -5px;
      left: 0;
      width: 100%;
      height: 64px;
      background-size: calc(100% + 17px);
      background-position: center top;
    }

    &.crown-multicolored {
      &:before {
        background-image: url("~/assets/images/mtg/card-frames/crown/gold.png");
      }
    }

    &.crown-artifact {
      &:before {
        background-image: url("~/assets/images/mtg/card-frames/crown/artifact.png");
      }
    }

    &.crown-colorless {
      &:before {
        background-image: url("~/assets/images/mtg/card-frames/crown/colorless.png");
      }
    }

    &.crown-W {
      &:before {
        background-image: url("~/assets/images/mtg/card-frames/crown/W.png");
      }
    }

    &.crown-U {
      &:before {
        background-image: url("~/assets/images/mtg/card-frames/crown/U.png");
      }
    }

    &.crown-B {
      &:before {
        background-image: url("~/assets/images/mtg/card-frames/crown/B.png");
      }
    }

    &.crown-R {
      &:before {
        background-image: url("~/assets/images/mtg/card-frames/crown/R.png");
      }
    }

    &.crown-G {
      &:before {
        background-image: url("~/assets/images/mtg/card-frames/crown/G.png");
      }
    }

    &.crown-WU, &.crown-UW {
      &:before {
        background-image: url("~/assets/images/mtg/card-frames/crown/WU.png");
      }
    }

    &.crown-WB, &.crown-BW {
      &:before {
        background-image: url("~/assets/images/mtg/card-frames/crown/WB.png");
      }
    }

    &.crown-WR, &.crown-RW {
      &:before {
        background-image: url("~/assets/images/mtg/card-frames/crown/RW.png");
      }
    }

    &.crown-WG, &.crown-GW {
      &:before {
        background-image: url("~/assets/images/mtg/card-frames/crown/GW.png");
      }
    }

    &.crown-UB, &.crown-BU {
      &:before {
        background-image: url("~/assets/images/mtg/card-frames/crown/UB.png");
      }
    }

    &.crown-UR, &.crown-RU {
      &:before {
        background-image: url("~/assets/images/mtg/card-frames/crown/UR.png");
      }
    }

    &.crown-UG, &.crown-GU {
      &:before {
        background-image: url("~/assets/images/mtg/card-frames/crown/GU.png");
      }
    }

    &.crown-BR, &.crown-RB {
      &:before {
        background-image: url("~/assets/images/mtg/card-frames/crown/BR.png");
      }
    }

    &.crown-BG, &.crown-GB {
      &:before {
        background-image: url("~/assets/images/mtg/card-frames/crown/BG.png");
      }
    }

    &.crown-RG, &.crown-GR {
      &:before {
        background-image: url("~/assets/images/mtg/card-frames/crown/RG.png");
      }
    }
  }

  & > .header-content {
    position: relative;
    display: flex;
    width: 100%;
    z-index: 5;

    & > .dog-tag {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: calc(38px * var(--size-adjustment));
      display: flex;
      color: #000;
      overflow: hidden;
      border-radius: 9px;

      &:before, &:after {
        content: '';
        position: absolute;
        top: 50%;
        --s-width: 60px;
        width: calc(var(--s-width) * var(--size-adjustment));
        min-width: calc(var(--s-width) * var(--size-adjustment));
        max-width: calc(var(--s-width) * var(--size-adjustment));
        height: calc(var(--s-width) * var(--size-adjustment));
        min-height: calc(var(--s-width) * var(--size-adjustment));
        max-height: calc(var(--s-width) * var(--size-adjustment));
        padding: 0;
        margin: 0;
        border-radius: 50%;
        transform: translateY(-50%);
      }
      &:before {
        left: 0;
      }
      &:after {
        right: 0;
      }

      & > .header-plate {
        position: absolute;
        top: 0;
        bottom: 0;
        left: calc(12px * var(--size-adjustment));
        right: calc(12px * var(--size-adjustment));
        z-index: 2;
      }

      & > .name {
        position: absolute;
        top: 50%;
        left: calc(20px * var(--size-adjustment));
        height: calc(22px * var(--size-adjustment));
        font-size: calc(18px * var(--size-adjustment));
        transition: all .3s ease-in-out;
        transform: translateY(-50%);
        overflow: hidden;
        z-index: 10;
      }

      & > .cost {
        position: absolute;
        top: calc(50%);
        right: calc(14px * var(--size-adjustment));
        height: calc(22px * var(--size-adjustment));
        transform: translateY(-50%);
        z-index: 12;
        padding-left: calc(4px * var(--size-adjustment));
        border-radius: calc(20px * var(--size-adjustment));
        backdrop-filter: blur(20px);
      }

      & > .name-plate {
        position: absolute;
        top: calc(6px * var(--size-adjustment));
        bottom: calc(6px * var(--size-adjustment));
        left: calc(10px * var(--size-adjustment));
        right: calc(10px * var(--size-adjustment));
        border-radius: calc(9px * var(--size-adjustment));
        transition: all .3s ease-in-out;
        box-shadow: calc((1px * .9) * -1) calc(1px * .8) 6px -2px #000;
        z-index: 3;
      }
    }
  }

  &:hover {
    & > .header-content {
      & > .dog-tag {

        & > .name {
          left: calc(22px * var(--size-adjustment));
        }

        & > .name-plate {
          left: calc(12px * var(--size-adjustment));
          right: calc(8px * var(--size-adjustment));
        }
      }
    }
  }

  & > .header-content {
    & > .dog-tag {
      &:before, &:after {
        background-color: #eb0;
      }

      & > .header-plate {
        background-color: #eb0;
      }

      & > .name-plate {
        background-color: #fff4;
      }
    }
  }

  &.color-identity-multicolored {
    & > .header-content {
      & > .dog-tag {
        &:before, &:after {
          background-color: #efd26e;
        }

        & > .header-plate {
          background-color: #efd26e;
        }

        & > .name-plate {
          background-color: #fff4;
        }
      }
    }
  }

  --header-color-land: #f2cbc6;
  --header-color-colorless: #959b9e;
  --header-color-artifact: #7e959b;
  --header-color-blue: #0981c4;
  --header-color-green: #007d4a;
  --header-color-black: #33312a;
  --header-color-white: #eae8e5;
  --header-color-red: #f7472b;

  &.color-identity-land {
    & > .header-content {
      & > .dog-tag {
        &:before, &:after {
          background-color: var(--header-color-land);
        }

        & > .header-plate {
          background-color: var(--header-color-land);
        }

        & > .name-plate {
          background-color: #fff4;
        }
      }
    }
  }

  &.color-identity-colorless {
    & > .header-content {
      & > .dog-tag {
        &:before, &:after {
          background-color: var(--header-color-colorless);
        }

        & > .header-plate {
          background-color: var(--header-color-colorless);
        }

        & > .name-plate {
          background-color: #fff4;
        }
      }
    }
  }

  &.color-identity-artifact {
    & > .header-content {
      & > .dog-tag {
        &:before, &:after {
          background-color: var(--header-color-artifact);
        }

        & > .header-plate {
          background-color: var(--header-color-artifact);
        }

        & > .name-plate {
          background-color: #fff4;
        }
      }
    }
  }

  &.color-identity-U {
    & > .header-content {
      & > .dog-tag {
        &:before, &:after {
          background-color: var(--header-color-blue);
        }

        & > .header-plate {
          background-color: var(--header-color-blue);
        }

        & > .name-plate {
          background-color: #fff4;
        }
      }
    }
  }

  &.color-identity-G {
    & > .header-content {
      & > .dog-tag {
        &:before, &:after {
          background-color: var(--header-color-green);
        }

        & > .header-plate {
          background-color: var(--header-color-green);
        }

        & > .name-plate {
          background-color: #fff4;
        }
      }
    }
  }

  &.color-identity-B {
    & > .header-content {
      & > .dog-tag {
        &:before, &:after {
          background-color: var(--header-color-black);
        }

        & > .header-plate {
          background-color: var(--header-color-black);
        }

        & > .name-plate {
          background-color: #fff4;
        }
      }
    }
  }

  &.color-identity-W {
    & > .header-content {
      & > .dog-tag {
        &:before, &:after {
          background-color: var(--header-color-white);
        }

        & > .header-plate {
          background-color: var(--header-color-white);
        }

        & > .name-plate {
          background-color: #fff4;
        }
      }
    }
  }

  &.color-identity-R {
    & > .header-content {
      & > .dog-tag {
        &:before, &:after {
          background-color: var(--header-color-red);
        }

        & > .header-plate {
          background-color: var(--header-color-red);
        }

        & > .name-plate {
          background-color: #fff4;
        }
      }
    }
  }

  &.color-identity-W_U, &.color-identity-U_W, &.color-identity-WU, &.color-identity-UW {
    & > .header-content {
      & > .dog-tag {
        &:before {
          background-color: var(--header-color-white);
        }

        &:after {
          background-color: var(--header-color-blue);
        }

        & > .header-plate {
          background: linear-gradient(90deg, var(--header-color-white) 0%, var(--header-color-white) 40%, var(--header-color-blue) 100%);
        }

        & > .name-plate {
          background-color: #fff4;
        }
      }
    }
  }

  &.color-identity-W_B, &.color-identity-B_W, &.color-identity-WB, &.color-identity-BW {
    & > .header-content {
      & > .dog-tag {
        &:before {
          background-color: var(--header-color-white);
        }

        &:after {
          background-color: var(--header-color-black);
        }

        & > .header-plate {
          background: linear-gradient(90deg, var(--header-color-white) 0%, var(--header-color-white) 40%, var(--header-color-black) 100%);
        }

        & > .name-plate {
          background-color: #fff4;
        }
      }
    }
  }

  &.color-identity-W_R, &.color-identity-R_W, &.color-identity-WR, &.color-identity-RW {
    & > .header-content {
      & > .dog-tag {
        &:before {
          background-color: var(--header-color-red);
        }

        &:after {
          background-color: var(--header-color-white);
        }

        & > .header-plate {
          background: linear-gradient(90deg, var(--header-color-red) 0%, var(--header-color-white) 40%, var(--header-color-white) 100%);
        }

        & > .name-plate {
          background-color: #fff4;
        }
      }
    }
  }

  &.color-identity-W_G, &.color-identity-G_W, &.color-identity-WG, &.color-identity-GW {
    & > .header-content {
      & > .dog-tag {
        &:before {
          background-color: var(--header-color-green);
        }

        &:after {
          background-color: var(--header-color-white);
        }

        & > .header-plate {
          background: linear-gradient(90deg, var(--header-color-green) 0%, var(--header-color-white) 40%, var(--header-color-white) 100%);
        }

        & > .name-plate {
          background-color: #fff4;
        }
      }
    }
  }

  &.color-identity-U_B, &.color-identity-B_U, &.color-identity-UB, &.color-identity-BU {
    & > .header-content {
      & > .dog-tag {
        &:before {
          background-color: var(--header-color-blue);
        }

        &:after {
          background-color: var(--header-color-black);
        }

        & > .header-plate {
          background: linear-gradient(90deg, var(--header-color-blue) 0%, var(--header-color-blue) 40%, var(--header-color-black) 100%);
        }

        & > .name-plate {
          background-color: #fff4;
        }
      }
    }
  }

  &.color-identity-U_R, &.color-identity-R_U, &.color-identity-UR, &.color-identity-RU {
    & > .header-content {
      & > .dog-tag {
        &:before {
          background-color: var(--header-color-blue);
        }

        &:after {
          background-color: var(--header-color-red);
        }

        & > .header-plate {
          background: linear-gradient(90deg, var(--header-color-blue) 0%, var(--header-color-blue) 40%, var(--header-color-red) 100%);
        }

        & > .name-plate {
          background-color: #fff4;
        }
      }
    }
  }

  &.color-identity-U_G, &.color-identity-G_U, &.color-identity-UG, &.color-identity-GU {
    & > .header-content {
      & > .dog-tag {
        &:before {
          background-color: var(--header-color-green);
        }

        &:after {
          background-color: var(--header-color-blue);
        }

        & > .header-plate {
          background: linear-gradient(90deg, var(--header-color-green) 0%, var(--header-color-blue) 40%, var(--header-color-blue) 100%);
        }

        & > .name-plate {
          background-color: #fff4;
        }
      }
    }
  }

  &.color-identity-B_R, &.color-identity-R_B, &.color-identity-BR, &.color-identity-RB {
    & > .header-content {
      & > .dog-tag {
        &:before {
          background-color: var(--header-color-black);
        }

        &:after {
          background-color: var(--header-color-red);
        }

        & > .header-plate {
          background: linear-gradient(90deg, var(--header-color-black) 0%, var(--header-color-black) 40%, var(--header-color-red) 100%);
        }

        & > .name-plate {
          background-color: #fff4;
        }
      }
    }
  }

  &.color-identity-B_G, &.color-identity-G_B, &.color-identity-BG, &.color-identity-GB {
    & > .header-content {
      & > .dog-tag {
        &:before {
          background-color: var(--header-color-black);
        }

        &:after {
          background-color: var(--header-color-green);
        }

        & > .header-plate {
          background: linear-gradient(90deg, var(--header-color-black) 0%, var(--header-color-black) 40%, var(--header-color-green) 100%);
        }

        & > .name-plate {
          background-color: #fff4;
        }
      }
    }
  }

  &.color-identity-R_G, &.color-identity-G_R, &.color-identity-RG, &.color-identity-GR {
    & > .header-content {
      & > .dog-tag {
        &:before {
          background-color: var(--header-color-red);
        }

        &:after {
          background-color: var(--header-color-green);
        }

        & > .header-plate {
          background: linear-gradient(90deg, var(--header-color-red) 0%, var(--header-color-red) 40%, var(--header-color-green) 100%);
        }

        & > .name-plate {
          background-color: #fff4;
        }
      }
    }
  }


  & > .details {
    position: relative;
    display: flex;
  }
}

.app-mtg-card-footer {
  position: relative;
  display: flex;
  width: 100%;
  height: 80px;
  z-index: 1;

  &:not(.small) {
    --size-adjustment: 1;
  }

  &.small {
    --size-adjustment: .8;
  }
}
</style>