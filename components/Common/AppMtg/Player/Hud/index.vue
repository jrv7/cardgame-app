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
  <div class="app-mtg-player-hud">
    <app-mtg-player-hud-right-side :session="Session" />

    <div class="card-holder">
      <slot name="cardHolder">
        card holder
      </slot>
    </div>

  </div>
</template>

<style scoped lang="scss">
.app-mtg-player-hud {
  --player-hand-hud-height: calc(100vh - 40px);
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-flow: nowrap;
  height: var(--player-hand-hud-height);
  background-color: #0004;
  z-index: 100;

  & > .card-holder {
    position: relative;
    display: flex;
    flex-flow: nowrap !important;
    width: calc(100vw - (64px + 320px));
    margin-top: auto;
    margin-bottom: 24px;
    z-index: 1;
  }
}
</style>