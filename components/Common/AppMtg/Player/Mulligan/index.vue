<script setup lang="ts">

import {SessionControllerClass} from "~/composables/entity/Controller/SessionControllerClass";
import {HandCardClass} from "~/composables/entity/Class/HandCardClass";

const emit = defineEmits(['hand-kept']);
const props = withDefaults(
    defineProps<{
      session:Ref<SessionControllerClass>
    }>(), {

    }
);

const Session:Ref<SessionControllerClass> = computed(() => props.session) as Ref<SessionControllerClass>;

const reDrawFirstHand = async (mulligan:boolean = false) => {
  if (mulligan) {
    await Session.value.Player.mulligan();
  }
  await Session.value.Player.shuffle()
      .then(() => {
        Session.value.Player.drawTop(7);
      })
}

const handleCardClicked = (c:HandCardClass) => {
  c.toggleVisibilityToOwner()
}

const loading = ref(false);
const handleKeepHand = async () => {
  loading.value = true;
  if (Session.value.Player.Hand.invisibleCards.length) {
    await Session.value.Player.putBack(Session.value.Player.Hand.invisibleCards.map(c => c.cardHash));
  }

  await Session.value.Player.persistHand()
      .then((respHandKept) => {
        Session.value.Player.persistLibrary()
            .then((respLibKept) => {
              Session.value.Player.keepHand(respHandKept)
                  .then(() => {
                    Session.value.Player.keepRefreshLibrary(respLibKept)
                        .then(() => {
                          emit('hand-kept', true);
                        }).catch(() => { emit('hand-kept', true); })
                  }).catch(() => { emit('hand-kept', false); })
            }).catch(() => { emit('hand-kept', false); })
      }).catch(() => { emit('hand-kept', false); })
}

onMounted(async () => {
  await reDrawFirstHand();
})
</script>

<template>
  <div
      class="app-mtg-player-mulligan"
  >
    <div class="top g-row padding-h-24">
      <span class="margin-h-auto text-size-huge">Draw your first hand {{
          ((Session!.Player.Hand.maxSize - Session!.Player.mulligans) < Session!.Player.Hand.maxSize) ? `( ${(Session!.Player.Hand.maxSize - Session!.Player.mulligans)} cards )` : ''
        }}</span>
    </div>

    <div class="center">
      <div class="g-row">
        <div class="g-col-12 flex-align-center margin-h-auto">

          <template v-for="(c, cIndex) in Session!.Player.Hand.cards">
            <div class="g-col-6">
              <div class="card-4-nm">
                <app-mtg-card
                    v-if="c?.card"
                    :card="c.card"
                    :visible="c.visibleToOwner"
                    hide-descriptions
                    hide-action
                    :clickable="(!c.visibleToOwner) || ((Session!.Player.mulligans - (Session!.Player.Hand.cards.length - Session!.Player.Hand.visibleCards.length)) !== 0)"
                    @click="handleCardClicked(c)"
                />
              </div>
            </div>
          </template>

        </div>
      </div>
<!--      <pre>{{ Session!.Player.Hand }}</pre>-->
    </div>

    <div class="bottom margin-top-auto margin-bottom-12">
      <div class="g-row">
        <div class="g-col-4 margin-left-auto margin-right-4">
          <app-button
              size="sm-squared"
              class="max-width"
              :disabled="loading || (Session!.Player.mulligans >= 6)"
              @click="reDrawFirstHand(true)"
          >
            {{ Session!.Player.mulligans < 0 ? 'FREE' : '' }} MULLIGAN
          </app-button>
        </div>
        <div class="g-col-4 margin-right-auto margin-left-4">
          <app-button
              type="success"
              size="sm-squared"
              class="max-width"
              :disabled="loading || ((Session!.Player.Hand.cards.length - Session!.Player.Hand.visibleCards.length) < Session!.Player.mulligans)"
              @click="handleKeepHand()"
          >
            KEEP {{ Session!.Player.mulligans > 0 ? ((Session!.Player.mulligans - (Session!.Player.Hand.cards.length - Session!.Player.Hand.visibleCards.length)) ? `( ${(Session!.Player.mulligans - (Session!.Player.Hand.cards.length - Session!.Player.Hand.visibleCards.length))} to the bottom )` : '') : '' }}
          </app-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.app-mtg-player-mulligan {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #000e;
  display: flex;
  flex-direction: column;
  z-index: 1000;
}
</style>