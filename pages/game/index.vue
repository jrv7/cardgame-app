<script setup lang="ts">

import {Player} from "~/composables/entity/Player";
import {PlayerInterface} from "~/composables/entity/PlayerInterface";
import {AppTablePaginationType} from "~/composables/customTypes/AppTablePaginationType";
import {Card} from "~/composables/entity/Card";
import {CardType} from "~/composables/entity/CardInterface";
import {GameController} from "~/composables/controller/GameController";
import {Game} from "~/composables/entity/Game";
import {GamePlayer} from "~/composables/entity/GamePlayer";
import {GamePlayerInterface} from "~/composables/entity/GamePlayerInterface";

definePageMeta({
  layout: 'game'
});

const router = useRouter();
const meCookie = useCookie('currentplayer');
const mulliganCookie = useCookie('mulligans');
const myPlayerId = computed({
  get: () => {
    return parseInt(meCookie.value!);
  },
  set: (id:number) => {
    meCookie.value = `${id}`;
  }
})
const gameCookie = useCookie('currentgame');
const ready = ref(false);
const CGame:GameController|null = ref(null) as GameController|null;

const playerAvailableList:PlayerInterface[] = ref([]) as PlayerInterface[];
const playerAvailableListPagination:AppTablePaginationType = ref({
  page: 1,
  pages: 1,
  pageSize: 100,
  total: 0,
  from: 1,
  to:1
}) as AppTablePaginationType;

const playerReadyList:GamePlayerInterface[] = ref([]) as GamePlayerInterface[];
const playerReadyListPagination:AppTablePaginationType = ref({
  page: 1,
  pages: 1,
  pageSize: 25,
  total: 0,
  from: 1,
  to:1
}) as AppTablePaginationType;
const playersHeaderAvailable = new Card({id: 1, name: 'Available', manaCost: '{W}{U}{B}{R}{G}'} as CardType)
const playersHeaderReady = new Card({id: 1, name: 'Ready to play', manaCost: '{W}{U}{B}{R}{G}'} as CardType)
const isLoadingPlayers = ref(false);

const handleGoToGame = async () => {
  await router.push(`/game/${gameCookie.value}`);
}

onBeforeMount(async () => {
  await useDynamicPost('/games/last-or-new')
      .then((gameResp) => {
        CGame.value = new GameController(new Game(gameResp.data));

        if (!meCookie.value) {
          meCookie.value = '1';
        }
        gameCookie.value = CGame.value.getGame().getUid();
        mulliganCookie.value = 0;
        ready.value = true;
      })
});
</script>

<template>
  <div class="app-mtg-page-game-new" v-if="ready">
    <div class="top-bar"></div>

    <div class="player-list available-players">
      <div class="header">
        <app-mtg-card-header
            :card="playersHeaderAvailable"
            has-crown
            hide-cost
            small
        />
      </div>

      <app-table-core
          ref="TableCoreRef"
          url="/players/available"
          :Entity="Player"
          :infinite="true"
          v-model:data="playerAvailableList"
          v-model:pagination="playerAvailableListPagination"
          v-model:loading="isLoadingPlayers"
      >
        <app-list
            :table-data="playerAvailableList"
            :Entity="Player"
            :title="$_Tt('players')"
            inline
            allow-filter
            hide-action-bar
            :infinite="true"
            :loading="isLoadingPlayers"
            :items-per-row="1"
            v-model:pagination="playerAvailableListPagination"
            no-skeleton
        >
          <template #app-list-item="{itemData}">
            <div class="player-list-item">
              <div class="img">
                <template v-if="itemData.getAvatarUrl()">
                  <img :src="itemData.getAvatarUrl()" :alt="itemData.getName()">
                </template>
                <template v-else>
                  <img src="~/assets/images/mtg/avatars/fblthp.png" :alt="itemData.getName()">
                </template>
              </div>
              <div class="data">
                <span class="name">{{ itemData.getName() }}</span>
                <span class="nickname">{{ itemData.getNickname() }}</span>
              </div>
            </div>
          </template>
        </app-list>
      </app-table-core>
    </div>

    <div class="player-list ready-players">
      <div class="header">
        <app-mtg-card-header
            :card="playersHeaderReady"
            has-crown
            hide-cost
            small
        />
      </div>

      <app-table-core
          ref="TableCoreRef"
          :url="`/players/ready/${CGame.getGame().getUid()}`"
          :Entity="GamePlayer"
          :infinite="true"
          v-model:data="playerReadyList"
          v-model:pagination="playerReadyListPagination"
          v-model:loading="isLoadingPlayers"
      >
        <app-list
            :table-data="playerReadyList"
            :Entity="GamePlayer"
            :title="$_Tt('ready_players')"
            inline
            allow-filter
            hide-action-bar
            :infinite="true"
            :loading="isLoadingPlayers"
            :items-per-row="1"
            v-model:pagination="playerReadyListPagination"
            no-skeleton
        >
          <template #app-list-item="{itemData}">
            <div
                class="player-list-item"
                :class="{'current-player': myPlayerId === itemData.player.id}"
            >
              <div class="img">
                <template v-if="itemData.getPlayer().getAvatarUrl()">
                  <img :src="itemData.getPlayer().getAvatarUrl()" :alt="itemData.getPlayer().getName()">
                </template>
                <template v-else>
                  <img src="~/assets/images/mtg/avatars/fblthp.png" :alt="itemData.getPlayer().getName()">
                </template>
              </div>
              <div class="data">
                <app-button
                    type="link"
                    size="xs"
                    :value="itemData.player.id"
                    v-model="myPlayerId"
                >
                  <span class="name">{{ itemData.getPlayer().getName() }}</span>
                </app-button>
                <span class="nickname">{{ itemData.getPlayer().getNickname() }} {{ itemData.getDeck() ? (` + ${itemData.getDeck().getName()}`) : '' }}</span>
              </div>
              <div class="deck">
                <template v-if="itemData.getDeck()">
                  <img :src="itemData.getDeck().getCoverCard().getImageUrl()" :alt="itemData.getDeck().getName()">
                </template>
                <template v-else>
                  <app-button
                      type="primary"
                      size="xs-squared"
                  >
                    <fa-icon :icon="['fas', 'plus']" />
                  </app-button>
                </template>
              </div>
            </div>
          </template>
        </app-list>
      </app-table-core>
    </div>

    <div class="actions">
      <app-button
          type="secondary"
          size="sm"
          class="max-width"
          @click="handleGoToGame()"
      >
        <i class="ss ss-pxbox ss-2x ss-mythic"></i> Play
      </app-button>
    </div>
  </div>
</template>