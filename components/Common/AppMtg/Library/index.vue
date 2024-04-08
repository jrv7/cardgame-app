<script setup lang="ts">

import {HashedCardType} from "~/composables/customTypes/GameSessionType";

const emit = defineEmits(['dragged-to-bottom', 'dragged-to-top']);
const globalState = useGlobalState();

const props = withDefaults(
    defineProps<{
      cards:HashedCardType[],
      deckSize?:number,
      showFirstCard?:boolean,
      allowDragToTop?:boolean,
      allowDragToBottom?:boolean,
      noDropZones?:boolean,
      verticalPerspective?:string,
      horizontalPerspective?:string,
      verticalPerspectiveModifier?:number,
      horizontalPerspectiveModifier?:number,
    }>(), {
      deckSize: 99,
      showFirstCard: false,
      allowDragToTop: true,
      allowDragToBottom: true,
      noDropZones: false,
      verticalPerspective: 'top',
      horizontalPerspective: 'left',
      verticalPerspectiveModifier: 1,
      horizontalPerspectiveModifier: 1
    }
);
const cardsVisible = ref(20);
const currentPercentage = computed(() => {
  return props.cards.length / props.deckSize;
});

const isDragging = computed(() => {
  return globalState.value.isDragging;
})

const parseFirstCardId = computed(() => {
  return props.cards[0].card;
})

const setActiveDragDrawer = (position:string) => {
  switch (position) {
    case 'top': {
      emit('dragged-to-top', globalState.value.draggableElement);
    } break;
    case 'bottom': {
      emit('dragged-to-bottom', globalState.value.draggableElement);
    } break;
  }
}

const handleHover = () => {

}
</script>

<template>
  <div
      class="app-mtg-library"
      :class="{
        'can-drag-to-bottom': allowDragToBottom,
        'can-drag-to-top': allowDragToTop,
        'is-dragging': isDragging
      }"
      :style="{'top': `${(-1 * (parseInt(cardsVisible * currentPercentage) / 2))}px`, 'left': `${(-1 * (parseInt(cardsVisible * currentPercentage) / 2))}px`}"
  >
    <ul
        class="library-pile"
        @mouseenter="handleHover()"
    >
      <template v-for="n in parseInt(cardsVisible * currentPercentage)" :key="`lib-card-${n}`">
        <li :style="{'top': `${verticalPerspective === 'top' ? '' : '-'}${(n * verticalPerspectiveModifier)}px`, 'left': `${horizontalPerspective === 'right' ? '-' : ''}${horizontalPerspective === 'center' ? '0' : (n * horizontalPerspectiveModifier)}px`}">
          <template v-if="showFirstCard && n === parseInt(cardsVisible * currentPercentage)">
            <app-mtg-card-id-holder
                :card-id="parseFirstCardId"
                hide-action
            />
          </template>
          <template v-else-if="n === 1 && cards?.length">
            <div class="last-card">
              {{ cards.length }} card{{ cards.length > 1 ? 's' : '' }}
            </div>
          </template>
          <template v-else>
            <app-mtg-card-skeleton no-opacity />
          </template>
        </li>
      </template>
    </ul>

    <template v-if="!noDropZones">
      <ol
          v-if="allowDragToBottom"
          class="drag-container bottom"
          @mouseenter="setActiveDragDrawer('bottom')"
      >
        <li id="LibraryDropBottom">
          <span>Bottom</span>
        </li>
      </ol>
      <ol
          v-if="allowDragToTop"
          class="drag-container top drop-container"
          @mouseenter="setActiveDragDrawer('top')"
      >
        <li id="LibraryDropTop">
          <span>Top</span>
        </li>
      </ol>
    </template>
  </div>
</template>

<style lang="scss">
.app-mtg-library {
  position: relative;
  display: flex;
  width: 0;
  padding: calc(((100% / 2) * 1.4) + 12px) calc((100% / 2) + 12px);
  z-index: 1;

  & > .library-pile {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    width: 100%;
    padding: 0;
    margin: 0;
    z-index: 10;

    & > li {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;

      &:nth-of-type(2) {
        box-shadow: 0 0 12px #000;
      }

      & > .last-card {
        position: absolute;
        top: 0;
        bottom: 0;
        right: 100%;
        width: 100%;
        transition: all .3s ease-in-out;
      }
    }
  }

  & > .drag-container {
    position: absolute;
    top: 0;
    bottom: 0;
    padding: 0;
    margin: 0;
    background-color: #0009;
    transition: all .3s ease-in-out;
    opacity: 0;
    z-index: 100;

    & > li {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 0;
      margin: 0;

      & > span {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }

    &:hover {
      background-color: #fff9;
    }

    &.bottom {
      left: 0;
    }

    &.top {
      right: 0;
    }
  }

  &.is-dragging {
    & > .drag-container {
      opacity: 1;
    }
  }

  &.can-drag-to-top {
    &.can-drag-to-bottom {
      & > .drag-container {
        &.bottom {
          left: 0;
          width: 50%;
          border-radius: 8px 0 0 8px;
        }

        &.top {
          right: 0;
          width: 50%;
          border-radius: 0 8px 8px 0;
        }
      }
    }
    &:not(.can-drag-to-bottom) {
      & > .drag-container {
        &.bottom {
          display: none;
        }

        &.top {
          right: 0;
          width: 100%;
          border-radius: 8px;
        }
      }
    }
  }

  &.can-drag-to-bottom {
    &.can-drag-to-top {
      & > .drag-container {
        &.bottom {
          left: 0;
          width: 50%;
          border-radius: 8px 0 0 8px;
        }

        &.top {
          right: 0;
          width: 50%;
          border-radius: 0 8px 8px 0;
        }
      }
    }
    &:not(.can-drag-to-top) {
      & > .drag-container {
        &.top {
          display: none;
        }

        &.bottom {
          left: 0;
          width: 100%;
          min-width: 100%;
          max-width: 100%;
          border-radius: 8px;
        }
      }
    }
  }
}
</style>