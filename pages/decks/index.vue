<script setup lang="ts">

import LazyPageCardFilters from "~/components/Pages/Card/TableFilters/index.vue";
import LazyAppTable from "~/components/Common/AppTable/index.vue";
import LazyAppList from "~/components/Common/AppList/index.vue";
import {Ref} from "preact/compat";
import {UnwrapRef} from "vue";
import LazyPageCardDetails from "~/components/Pages/Card/Details/index.vue";
import {Deck} from "~/composables/entity/Deck";
import {DeckInterface} from "~/composables/entity/DeckInterface";
const route = useRoute();

const listType = ref('card');
const handleListTypeChange = (value:string) => {
  listType.value = value;
  const pageConfigsCookie = useCookie('pageconfigs');
  let configsCookie = [];

  if (pageConfigsCookie.value) {
    configsCookie = pageConfigsCookie.value;
  }

  let currentConfigs = configsCookie.find(i => i.page === route.path);
  if (!currentConfigs) {
    currentConfigs = {
      page: route.path,
      listType: value
    }
  } else {
    currentConfigs.listType = value;
  }

  let newConfigs = configsCookie.filter(i => i.page !== route.path);
  newConfigs.push(currentConfigs);
  //
  pageConfigsCookie.value = JSON.stringify(newConfigs);
}

const ready = ref(false);
const parseComponent = computed(() => {
  if (listType.value === 'list') {
    return LazyAppTable;
  }

  return LazyAppList;
});

const DeckEntity = new Deck();
let tableData: Ref<UnwrapRef<DeckInterface[]>> = ref([]) as Ref<UnwrapRef<DeckInterface[]>>;

const pagination = ref({
  page: 1,
  pages: 1,
  pageSize: 10,
  total: 0,
  from: 1,
  to:10
});

const originalFilters = ref({
  simpleSearch: [],
  collectionsSets: [],
  types: [],
  subtypes: [],
  supertypes: [],
  colors: [],
  identityColors: [],
});
const filters = ref(useNuxtApp().$deepClone(originalFilters.value));
const parseHasFilters = computed(() => {
  return filters.value.simpleSearch.length
      || filters.value.collectionsSets.length
      || filters.value.types.length
      || filters.value.subtypes.length
      || filters.value.supertypes.length
      || filters.value.colors.length
      || filters.value.identityColors.length;
});
const refDecksList = ref(null);

const modalHandler = useModal();
const listUrl = ref('/decks');
const search = ref(null);
const columns = ref([
  { column: 'id', hidden: true, label: 'id', main: true},
  { column: 'name', label: 'name', searchable: true, dataType: 'string'}
]);
const selectedItems = ref([]);

const isLoading = ref(false);
const isLoadingTrigger: any = ref(null) as any;
const parseIsLoading = computed({
  get: () => {
    return isLoading.value;
  },
  set: (value) => {
    if (value) {
      clearTimeout(isLoadingTrigger.value);
      isLoading.value = value;
    } else {
      clearTimeout(isLoadingTrigger.value);

      isLoadingTrigger.value = setTimeout(() => {
        isLoading.value = value;
        clearTimeout(isLoadingTrigger.value);
        isLoadingTrigger.value = null;
      }, 800);
    }
  }
});

const parsePrimaryColumn = computed(() => {
  return DeckEntity.getPrimary();
});

const handleResetFilters = () => {
  filters.value = useNuxtApp().$deepClone(originalFilters.value);
}
const handleSelectAll = () => {
  console.log('Select all');
}

const openCardViewModal = (deck:DeckInterface, fromChild = false) => {
  const cardDetailsModal:AppModalType = modalHandler.getDefault();
  cardDetailsModal.title = `${useNuxtApp().$_Tt('deck')}: ${deck.name}`;
  cardDetailsModal.component = shallowRef(LazyPageCardDetails);
  cardDetailsModal.componentData = {
    deck: deck
  };
  cardDetailsModal.noPadding = true;
  cardDetailsModal.invisible = true;
  cardDetailsModal.type = 'full-right';
  cardDetailsModal.icon = ['fas', 'address-card'];
  cardDetailsModal.buttons = {
    confirm: false,
    cancel: {
      type: 'secondary',
      size: 'sm',
      iconLeft: 'arrow-left',
      text: useNuxtApp().$_Tt('go_back')
    },
    close: true
  }
  cardDetailsModal.onFinish = async (modalData) => {
    return new Promise((resolve, reject) => {
      const message = `${useNuxtApp().$_Tt('deck_delete_prompt_confirm_message')}`;
      const middleMessage = `<b>${deck.getName()}</b>`;
      const title = useNuxtApp().$_Tt('deck_delete_prompt_confirm_title');

      modalHandler.getDefaultConfirmation(message, title, middleMessage)
          .then(() => {
            // Delete card
            useDynamicPost(`/manager/card/delete/${modalData}`)
                .then((response) => {
                  resolve(true);
                })
                .catch(() => {
                  console.log('Could not delete card');
                })
          })
          .catch(() => {
            console.log('Confirmation rejected');
          })
    })
  }
  cardDetailsModal.onCancel = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('After 2 seconds... closing');
        resolve(true);
      }, 100);
    });
  }
  modalHandler.set(cardDetailsModal);
  modalHandler.show(cardDetailsModal);
}

onNuxtReady(async () => {

  await new Promise((resolve) => {
    const pageFiltersCookie = useCookie('pagefilters');
    if (pageFiltersCookie.value) {
      const currentPageFilters = pageFiltersCookie.value.find(i => i.page === route.path);

      if (currentPageFilters) {
        filters.value = currentPageFilters.filters;
      }
    }

    const pageConfigsCookie = useCookie('pageconfigs');
    if (pageConfigsCookie.value) {
      const pageConfigs = pageConfigsCookie.value.find(i => i.page === route.path);

      if (pageConfigs) {
        listType.value = pageConfigs.listType;
      }
    }

    resolve();
  })
      .then(() => {
        setTimeout(() => {
          ready.value = true;
        }, 200)
      })
})
</script>

<template>
  <div class="app-mtg--deck-list" v-if="ready">
    <div class="g-row">
      <div class="g-col --span-24">
        <app-table-header-actions
            :filters-component="shallowRef(LazyPageCardFilters)"
            v-model:filter="filters"
            v-model:string-search="search"
            :has-filters="!!parseHasFilters"
            title="Cards"
            @reset-filters="handleResetFilters()"
        >
          <template #first-slot>
            <app-button-group>
              <app-button
                  :type="listType === 'list' ? 'primary' : 'secondary'"
                  size="sm-squared"
                  @click="handleListTypeChange('list')"
              >
                <fa-icon :icon="['fas', 'bars']" />
              </app-button>
              <app-button
                  :type="listType === 'card' ? 'primary' : 'secondary'"
                  size="sm-squared"
                  @click="handleListTypeChange('card')"
              >
                <fa-icon :icon="['fas', 'square-caret-down']" />
              </app-button>
            </app-button-group>
          </template>
        </app-table-header-actions>
      </div>
    </div>
    <div class="g-row">
      <div class="g-col --span-24">
        <app-table-core
            ref="TableCoreRef"
            :url="listUrl"
            :Entity="Deck"
            v-model:data="tableData"
            v-model:pagination="pagination"
            v-model:loading="parseIsLoading"
            v-model:search="search"
            v-model:filters="filters"
            :primary-column="parsePrimaryColumn"
        >
          <component
              :is="parseComponent"
              ref="refDecksList"
              :table-data="tableData"
              :columns="columns"
              :Entity="Deck"
              :selected="selectedItems"
              :title="$_Tt('decks')"
              allow-filter
              hide-action-bar
              :loading="parseIsLoading"
              v-model:pagination="pagination"
              v-model:filter="filters"
              v-model:search="search"
              @select-all="handleSelectAll"
              @reset-filters="handleResetFilters()"
          >
            <template #app-list-item="{itemData}">
              <app-mtg-deck-box :deck="itemData"></app-mtg-deck-box>
            </template>

            <template #head-column-actions="{rowData}">
              <fa-icon :icon="['fas', 'diamond']" />
            </template>

            <template #column_name="{rowData}">
              <div class="g-row">
                <div class="g-col --span-24">
                  <div class="g-row">
                    <div class="g-col --span-24">
                  <span class="text-strong">
                    <a href="javascript: () => null" @click.prevent="openCardViewModal(rowData)">{{ rowData.getName() }}</a>
                    <!-- app-badge :value="rowData.uid" type="warning" size="sm" / -->
                  </span>
                    </div>
                  </div>
                  <div class="g-row">
                    <div class="g-col --span-24">
                      <span>{{ rowData.getGameFormat()?.getName() }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </template>

          </component>
        </app-table-core>
      </div>
    </div>
  </div>
</template>