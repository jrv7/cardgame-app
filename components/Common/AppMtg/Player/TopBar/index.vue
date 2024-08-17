<script setup lang="ts">
import {SessionControllerClass} from "~/composables/entity/Controller/SessionControllerClass";

const props = withDefaults(
    defineProps<{
      session:Ref<SessionControllerClass>
    }>(), {

    }
);
</script>

<template>
  <div class="app-mtg-player-top-bar">
    <ul class="items">
      <li>Items left</li>
      <li class="player-head">
        <div class="player-bubble">

        </div>
      </li>
      <li>Items right</li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.app-mtg-player-top-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  min-height: 40px;

  & > .items {
    --head-size: 120px;
    position: relative;
    display: flex;
    flex-flow: nowrap;
    width: 100%;
    justify-content: center;

    & > li {
      width: calc((100% / 2) - (var(--head-size) / 2));
    }

    & > li.player-head {
      position: relative;
      display: flex;
      width: var(--head-size);
      min-width: var(--head-size);
      max-width: var(--head-size);
      height: var(--head-size);
      min-height: var(--head-size);
      max-height: var(--head-size);
      background-color: #0004;
      border-radius: 50%;

    }
  }
}
</style>