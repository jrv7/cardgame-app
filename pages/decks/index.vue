<script setup lang="ts">

import {Ref} from "preact/compat";
import {UnwrapRef} from "vue";
import LazyPageDeckDetails from "~/components/Pages/Deck/Details/index.vue";
import {Deck} from "~/composables/entity/Deck";
import {DeckInterface} from "~/composables/entity/DeckInterface";
const route = useRoute();
const router = useRouter();

const TableCoreRef = ref(null);
const ready = ref(false);
const DeckEntity = new Deck();
let tableData: Ref<UnwrapRef<DeckInterface[]>> = ref([]) as Ref<UnwrapRef<DeckInterface[]>>;
const listReloadTrigger:any = ref(null) as any;
const searchTrigger:any = ref(null) as any;

const pageSettings = ref({
  list: {
    listType: 'card',
    listItemsPerRow: 5
  }
});
const pagination = ref({
  page: 1,
  pages: 1,
  pageSize: 10,
  total: 0,
  from: 1,
  to:10
});

const colors = ref([
  {
    code: '{W}',
    name: 'white'
  },
  {
    code: '{U}',
    name: 'blue'
  },
  {
    code: '{B}',
    name: 'black'
  },
  {
    code: '{R}',
    name: 'red'
  },
  {
    code: '{G}',
    name: 'green'
  },
  {
    code: '{C}',
    name: 'generic'
  }].map((i, index) => {
  return {
    id: index + 1,
    ...i
  }
}));

const originalFilters = ref({
  simpleSearch: [],
  stringSearch: null,
  collectionsSets: [],
  types: [],
  subtypes: [],
  supertypes: [],
  colors: colors.value,
  identityColors: [],
  filterColorsIn: 'colors',
  colorMatch: 'any',
  borderless: false,
  landsOnly: false
});
const filters = ref(useNuxtApp().$deepClone(originalFilters.value));
const parsedFilters = computed({
  get: () => {
    return filters.value;
  },
  set: (value) => {
    useLocalApiPost(`/pages${route.path}/filters/set`, value)
        .then(() => {
          filters.value = value;
        });
  }
});
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

const filteredMana = ref(useNuxtApp().$deepClone(colors.value));
const parsedFilteredMana = computed({
  get: () => {
    return filteredMana.value;
  },
  set: (value:{code:string, name:string, id?:number}[]) => {
    filteredMana.value = value;

    let currentFilters = useNuxtApp().$deepClone(filters.value);
    currentFilters.colors = value;
    parsedFilters.value = currentFilters;
    pagination.value.page = 1;

    clearTimeout(listReloadTrigger.value);
    listReloadTrigger.value = null;
    listReloadTrigger.value = setTimeout(() => {
      TableCoreRef.value.reload();
      clearTimeout(listReloadTrigger.value);
      listReloadTrigger.value = null;
    }, 1200);
  }
});

const parseColorFilterTypeFilter = computed({
  get: () => {
    return filters.value.filterColorsIn;
  },
  set: async (value:string) => {
    let currentFilters = useNuxtApp().$deepClone(filters.value);
    currentFilters.filterColorsIn = value;

    parsedFilters.value = currentFilters;

    pagination.value.page = 1;

    clearTimeout(listReloadTrigger.value);
    listReloadTrigger.value = null;

    listReloadTrigger.value = setTimeout(() => {
      TableCoreRef.value.reload();
      clearTimeout(listReloadTrigger.value);
      listReloadTrigger.value = null;
    }, 400)
  }
});

const parsedColorMatchFilter = computed({
  get: () => {
    return filters.value.colorMatch;
  },
  set: (value:string) => {
    let currentFilters = useNuxtApp().$deepClone(filters.value);
    currentFilters.colorMatch = value;
    parsedFilters.value = currentFilters;

    clearTimeout(searchTrigger.value);
    searchTrigger.value = null;
    searchTrigger.value = setTimeout(() => {
      TableCoreRef.value.reload();
      clearTimeout(searchTrigger.value);
      searchTrigger.value = null;
    }, 200);
  }
});

const parsedBorderlessFilter = computed({
  get: () => {
    return filters.value.borderless;
  },
  set: (value:boolean) => {
    let currentFilters = useNuxtApp().$deepClone(filters.value);
    currentFilters.borderless = value;
    parsedFilters.value = currentFilters;

    clearTimeout(searchTrigger.value);
    searchTrigger.value = null;
    searchTrigger.value = setTimeout(() => {
      TableCoreRef.value.reload();
      clearTimeout(searchTrigger.value);
      searchTrigger.value = null;
    }, 200);
  }
});

const parsedLandsOnlyFilter = computed({
  get: () => {
    return filters.value.landsOnly;
  },
  set: (value:boolean) => {
    let currentFilters = useNuxtApp().$deepClone(filters.value);
    currentFilters.landsOnly = value;
    parsedFilters.value = currentFilters;

    clearTimeout(searchTrigger.value);
    searchTrigger.value = null;
    searchTrigger.value = setTimeout(() => {
      TableCoreRef.value.reload();
      clearTimeout(searchTrigger.value);
      searchTrigger.value = null;
    }, 200);
  }
});

const searchedString = ref(null);
const parsedSearchText = computed({
  get: () => {
    return searchedString.value;
  },
  set: (value:string|null) => {
    let currentSearch = null;
    if (value && value.length) {
      currentSearch = value;
    }

    searchedString.value = currentSearch;
  }
});

const modalHandler = useModal();
const listUrl = ref('/decks');
const search = ref(null);
const columns = ref([
  { column: 'id', hidden: true, label: 'id', main: true},
  { column: 'name', label: 'name', searchable: true, dataType: 'string'}
]);

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

const openDeckViewModal = (deck:DeckInterface, fromChild = false) => {
  const deckDetailsModal:AppModalType = modalHandler.getDefault();
  deckDetailsModal.title = `${useNuxtApp().$_Tt('deck')}: ${deck.name}`;
  deckDetailsModal.component = shallowRef(LazyPageDeckDetails);
  deckDetailsModal.componentData = {
    deck: deck
  };
  deckDetailsModal.noPadding = true;
  deckDetailsModal.invisible = true;
  deckDetailsModal.type = 'full-right';
  deckDetailsModal.icon = ['fas', 'address-deck'];
  deckDetailsModal.buttons = {
    confirm: {
      type: 'primary',
      size: 'sm',
      iconLeft: 'edit',
      class: ['width-32'],
      text: useNuxtApp().$_Tt('edit')
    },
    cancel: false,
    close: true
  }
  deckDetailsModal.onFinish = async (modalData) => {
    console.log('Deck modal data:', modalData);
    await router.push(`/decks/editor/${deck.getId()}`);
  }
  deckDetailsModal.onCancel = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('After 2 seconds... closing');
        resolve(true);
      }, 100);
    });
  }
  modalHandler.set(deckDetailsModal);
  modalHandler.show(deckDetailsModal);
}

/**
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */
onNuxtReady(async () => {
  await new Promise((resolve) => {
    useLocalApiPost(`/pages${route.path}/settings/get`)
        .then((item) => {
          if (item) {
            pageSettings.value = item;
          }

          if (pageSettings.value.list.listType === 'card') {
            pagination.value.pageSize = 25;
          }
        })
    useLocalApiPost(`/pages${route.path}/filters/get`)
        .then((item) => {
          if (item) {
            filters.value = item;
            if (item.colors) {
              filteredMana.value = item.colors;
            }

            if (item.stringSearch.length) {
              searchedString.value = item.stringSearch;
            }
          }
        })

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
            v-model:filter="filters"
            v-model:string-search="parsedSearchText"
            :has-filters="!!parseHasFilters"
            title="Cards"
            hide-advanced-filters
            @reset-filters="handleResetFilters()"
        >
          <template #first-slot>
            <ul class="filter-group">
              <li>
                <app-mtg-mana-bar
                    ref="manaBarRef"
                    v-model="parsedFilteredMana"
                    v-model:filterSource="parseColorFilterTypeFilter"
                    v-model:color-match="parsedColorMatchFilter"
                    v-model:borderless="parsedBorderlessFilter"
                    v-model:lands-only="parsedLandsOnlyFilter"
                />
              </li>
            </ul>
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
          <app-list
              ref="refDecksList"
              :table-data="tableData"
              :columns="columns"
              :Entity="Deck"
              :title="$_Tt('decks')"
              hide-action-bar
              allow-filter
              :loading="parseIsLoading"
              v-model:pagination="pagination"
              v-model:filter="filters"
          >
            <template #app-list-item="{itemData}">
              <app-mtg-deck-box
                  :deck="itemData"
                  @click="openDeckViewModal(itemData)"
              />
            </template>
          </app-list>
        </app-table-core>
      </div>
    </div>
  </div>
</template>