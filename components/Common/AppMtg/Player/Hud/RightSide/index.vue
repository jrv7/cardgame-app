<script setup lang="ts">
import {SessionControllerClass} from "~/composables/entity/Controller/SessionControllerClass";

const props = withDefaults(
    defineProps<{
      session:Ref<SessionControllerClass>
    }>(), {

    }
);

const Session:Ref<SessionControllerClass> = computed(() => props.session) as Ref<SessionControllerClass>;
</script>

<template>
  <ul class="right-side-items">
    <li>A</li>
    <li>A</li>
    <li>A</li>
    <li>A</li>
    <li class="spacer"> </li>
    <li>
      <i class="text-size-24 text-color-white" :class="`ss ss-pd3`"></i>
      <span class="d-flex margin-left-4 margin-h-auto">{{ Session.Player?.Graveyard?.cards?.length ?? '0' }}</span>
    </li>
    <li>
      <i class="text-size-24 text-color-white" :class="`ss ss-ptsa`"></i>
      <span class="d-flex margin-left-4 margin-h-auto">{{ Session.Player?.Exile?.cards?.length ?? '0' }}</span>
    </li>
    <li class="d-flex">
      <i class="text-size-32 text-color-yellow-100" :class="`ss ss-bcore`"></i>
      <span class="d-flex margin-left-4 margin-h-auto whitespace-nowrap">
          {{ Session.Player?.Hand?.cards?.length ?? '0' }}/{{ Session.Player?.Hand?.maxSize >= 0 ? `${Session.Player?.Hand?.maxSize}` : '∞' }}
        </span>
    </li>
  </ul>
</template>

<style scoped lang="scss">
ul.right-side-items {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 52px;
  height: var(--player-hand-hud-height);
  min-height: var(--player-hand-hud-height);
  max-height: var(--player-hand-hud-height);
  z-index: 10;

  & > li {
    position: relative;
    display: flex;
    width: 100%;
    text-align: center;
    justify-content: center;
    padding: 12px 4px;

    &.spacer {
      margin: auto;
    }

    &:last-of-type {
      padding-bottom: 24px;
    }

    &.clickable { cursor: pointer; }
  }
}
</style>