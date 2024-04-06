<script setup lang="ts">

import {Player} from "~/composables/entity/Player";
import {PlayerInterface} from "~/composables/entity/PlayerInterface";
import {AppTablePaginationType} from "~/composables/customTypes/AppTablePaginationType";
import {Card} from "~/composables/entity/Card";
import {CardType} from "~/composables/entity/CardInterface";

definePageMeta({
  layout: 'game'
});

const playersList:PlayerInterface[] = ref([]) as PlayerInterface[];
const playerListPagination:AppTablePaginationType = ref({
  page: 1,
  pages: 1,
  pageSize: 25,
  total: 0,
  from: 1,
  to:1
}) as AppTablePaginationType;
const playersHeader = new Card({id: 1, name: 'Players', manaCost: '{W}{U}{B}{R}{G}'} as CardType)
const isLoadingPlayers = ref(false);

</script>

<template>
  <div class="app-mtg-page-game-new">
    <div class="top-bar"></div>

    <div class="player-list">
      <div class="header">
        <app-mtg-card-header
            :card="playersHeader"
            has-crown
            hide-cost
            small
        />
      </div>

      <app-table-core
          ref="TableCoreRef"
          url="/players"
          :Entity="Player"
          :infinite="true"
          v-model:data="playersList"
          v-model:pagination="playerListPagination"
          v-model:loading="isLoadingPlayers"
      >
        <app-list
            :table-data="playersList"
            :Entity="Player"
            :title="$_Tt('players')"
            inline
            allow-filter
            hide-action-bar
            :infinite="true"
            :loading="isLoadingPlayers"
            :items-per-row="1"
            v-model:pagination="playerListPagination"
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
  </div>
</template>