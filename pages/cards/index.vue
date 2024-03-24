<script setup lang="ts">
import LazyPageCardDetails from '~/components/Pages/Card/Details';
import LazyPageCardFilters from '~/components/Pages/Card/TableFilters';
import {Card} from "~/composables/entity/Card";
import {UnwrapRef} from "vue";
import {CardInterface} from "~/composables/entity/CardInterface";
import {Ref} from "preact/compat";
import LazyAppTable from '~/components/Common/AppTable';
import LazyAppList from '~/components/Common/AppList';

const route = useRoute();

const listType = ref('card');
const ready = ref(false);
const parseComponent = computed(() => {
  if (listType.value === 'list') {
    return LazyAppTable;
  }

  return LazyAppList;
});

const CardEntity = new Card();
let tableData: Ref<UnwrapRef<CardInterface[]>> = ref([]) as Ref<UnwrapRef<CardInterface[]>>;

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
})

const refCardsList = ref(null);
const modalHandler = useModal();
const listUrl = ref('/cards');
const search = ref(null);
const columns = ref([
  { column: 'id', hidden: true, label: 'id', main: true},
  { column: 'cmc', label: 'cmc', width: '4%', searchable: true, dataType: 'string'},
  { column: 'manaCost', label: 'manaCost', width: '4%', searchable: true, dataType: 'string'},
  { column: 'collectionSet', label: 'collectionSet', width: '4%', searchable: true, dataType: 'string'},
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
  return CardEntity.getPrimary();
});

const handleResetFilters = () => {
  filters.value = useNuxtApp().$deepClone(originalFilters.value);
}
const handleSelectAll = () => {
  console.log('Select all');
}

const openCardViewModal = (card, fromChild = false) => {
  const cardDetailsModal:AppModalType = modalHandler.getDefault();
  cardDetailsModal.title = `${useNuxtApp().$_Tt('card')}: ${card.name}`;
  cardDetailsModal.component = shallowRef(LazyPageCardDetails);
  cardDetailsModal.componentData = {
    card: card
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
      const message = `${useNuxtApp().$_Tt('card_delete_prompt_confirm_message')}`;
      const middleMessage = `<b>${card.userUid}</b>`;
      const title = useNuxtApp().$_Tt('card_delete_prompt_confirm_title');

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
  <div class="app-page--cards-list" v-if="ready">
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
                  :value="'list'"
                  v-model="listType"
              >
                <fa-icon :icon="['fas', 'bars']" />
              </app-button>
              <app-button
                  :type="listType === 'card' ? 'primary' : 'secondary'"
                  size="sm-squared"
                  :value="'card'"
                  v-model="listType"
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
            :Entity="Card"
            v-model:data="tableData"
            v-model:pagination="pagination"
            v-model:loading="parseIsLoading"
            v-model:search="search"
            v-model:filters="filters"
            :primary-column="parsePrimaryColumn"
        >
          <component
              :is="parseComponent"
              ref="refCardsList"
              :table-data="tableData"
              :columns="columns"
              :Entity="Card"
              :selected="selectedItems"
              :title="$_Tt('cards')"
              allow-filter
              hide-action-bar
              v-model:pagination="pagination"
              v-model:filter="filters"
              v-model:search="search"
              @select-all="handleSelectAll"
              @reset-filters="handleResetFilters()"
          >
            <template #app-list-item="{itemData}">
              <app-mtg-card
                  :card="itemData"
                  @click="openCardViewModal(itemData)"
                  hide-descriptions
              />
            </template>

            <template #head-column-actions="{rowData}">
              <fa-icon :icon="['fas', 'diamond']" />
            </template>

            <template #column_manaCost="{rowData}">
              <app-mtg-mana-cost-symbol
                  v-if="rowData.getManaCost() !== null"
                  :value="rowData.getType() !== 'land' ? rowData.getManaCost() : '{LAND}'"
              />
              <app-mtg-mana-cost-symbol
                  v-else-if="rowData.getType() === 'Scheme'"
                  :value="'{SCHEME}'"
                  :title="rowData.getType()"
              />
              <app-mtg-mana-cost-symbol
                  v-else-if="rowData.getTypes().map(i => i.name).includes('Land')"
                  :value="'{LAND}'"
                  :title="rowData.getType()"
              />
              <app-mtg-mana-cost-symbol
                  v-else-if="rowData.getTypes().map(i => i.name).includes('Plane') || rowData.getTypes().map(i => i.name).includes('Phenomenon')"
                  :value="'{PLANE}'"
                  :title="rowData.getType()"
              />
              <span v-else>{{ rowData.getTypes() }}</span>
            </template>

            <template #column_collectionSet="{rowData}">
              <app-mtg-set-symbol
                  v-if="rowData.getCollectionSet() !== null"
                  :value="rowData.getCollectionSet()?.getCode()"
                  :rarity="rowData.getRarity()"
                  :name="rowData.getCollectionSet()?.getName()"
              />
              <span v-else>-</span>
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
                      <span>{{ rowData.getType() }}</span>
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