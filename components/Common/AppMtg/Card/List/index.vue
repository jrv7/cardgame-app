<script setup lang="ts">
import LazyPageCardDetails from '~/components/Pages/Card/Details';
import LazyPageCardFilters from '~/components/Pages/Card/TableFilters';
import {Card} from "~/composables/entity/Card";
import {UnwrapRef} from "vue";
import {CardInterface} from "~/composables/entity/CardInterface";
import {Ref} from "preact/compat";
import {AppTablePaginationType} from "~/composables/customTypes/AppTablePaginationType";
import {SimpleButtonSizeType, SimpleButtonTypeType} from "~/composables/customTypes/SimpleButtonTypes";
import {DeckInterface} from "~/composables/entity/DeckInterface";

const route = useRoute();
const mtgState = useMtgState();

const TableCoreRef = ref(null);
const manaBarRef = ref(null);
const listReloadTrigger:any = ref(null) as any;
const ready = ref(false);

const props = withDefaults(
    defineProps<{
      prefilterColors?:{}[]|null,
      squareItems?:boolean,
      listSize?:number,
      pageSize?:number,
      infinite?:boolean,
      horizontalScroll?:boolean,
      deck?:DeckInterface|null
    }>(), {
      prefilterColors: null,
      squareItems: false,
      listSize: 5,
      pageSize: 24,
      infinite: false,
      horizontalScroll: false,
      deck: null
    }
);

const CardEntity = new Card();
let tableData: Ref<UnwrapRef<CardInterface[]>> = ref([]) as Ref<UnwrapRef<CardInterface[]>>;

const pagination:AppTablePaginationType = ref({
  page: 1,
  pages: 1,
  pageSize: props.pageSize,
  total: 0,
  from: 1,
  to:10
}) as AppTablePaginationType;

const customPageSize = computed(() => {
  return pageSettings.value.list.listItemsPerRow * 5
});// ref(parseInt(`${pagination.value.pageSize}`));

const corePagination = computed({
  get: () => {
    let currentPag = JSON.parse(JSON.stringify(pagination.value));
    currentPag.pageSize = customPageSize.value;
    return currentPag;
  },
  set: (val) => {
    pagination.value = val;
  }
})

const pageSettings = ref({
  list: {
    listItemsPerRow: props.listSize ?? 5
  }
});
const listItemsPerRow = computed({
  get: () => {
    return pageSettings.value.list.listItemsPerRow
  },
  set: (value:number) => {
    let current = useNuxtApp().$deepClone(pageSettings.value);
    current.list.listItemsPerRow = value;
    pageSettings.value = current;
    useLocalApiPost(`/pages${route.path}/settings/set`, current);

    clearTimeout(listReloadTrigger.value);
    listReloadTrigger.value = null;
    listReloadTrigger.value = setTimeout(() => {
      TableCoreRef.value.reload();
      clearTimeout(listReloadTrigger.value);
      listReloadTrigger.value = null;
    }, 1200)

  }
});

const parsedPagination = computed({
  get: () => {
    return pagination.value;
  },
  set: (value:AppTablePaginationType) => {
    pagination.value = value;
    setTimeout(() => {
      TableCoreRef.value.reload();
    }, 200)
  }
});

const originalFilters = ref({
  simpleSearch: [],
  stringSearch: null,
  collectionsSets: [],
  types: [],
  subtypes: [],
  supertypes: [],
  colors: ((props.prefilterColors && props.prefilterColors.length) ? mtgState.value.colors.filter(i => props.prefilterColors!.map(j => j.code).includes(i.code)) : mtgState.value.colors),
  identityColors: [],
  filterColorsIn: 'colors',
  colorMatch: 'any',
  borderless: false,
  landsOnly: false,
  filterByDeck: null
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

const parseHasFilters = computed(() => {
  return parsedFilters.value.simpleSearch.length
      || parsedFilters.value.collectionsSets.length
      || parsedFilters.value.types.length
      || parsedFilters.value.subtypes.length
      || parsedFilters.value.supertypes.length
      || parsedFilters.value.colors.length
      || parsedFilters.value.identityColors.length;
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

const modalHandler = useModal();
const listUrl = ref('/cards');
const searchTrigger:any = ref(null) as any;
const searchedString = ref(null);
const parsedSearchText = computed({
  get: () => {
    if (searchedString.value && searchedString.value !== 'null') {
      return searchedString.value;
    }

    return '';
  },
  set: (value:string|null) => {
    let currentSearch = null;
    if (value && value.length) {
      currentSearch = value;
    }

    searchedString.value = currentSearch;
  }
});

const handleSearch = () => {
  let currentFilters = useNuxtApp().$deepClone(parsedFilters.value);
  currentFilters.stringSearch = `${searchedString.value}`;
  parsedFilters.value = currentFilters;
  clearTimeout(listReloadTrigger.value);
  listReloadTrigger.value = setTimeout(() => {
    TableCoreRef.value.reload(true);
    clearTimeout(listReloadTrigger.value);
    listReloadTrigger.value = null;
  }, 200)
}

const selectedItems = ref([]);

const filteredMana = ref(useNuxtApp().$deepClone(((props.prefilterColors && props.prefilterColors.length) ? mtgState.value.colors.filter(i => props.prefilterColors!.map(j => j.code).includes(i.code)) : mtgState.value.colors)));
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
  parsedFilters.value = useNuxtApp().$deepClone(originalFilters.value);
}
const handleSelectAll = () => {
  console.log('Select all');
}

const toggleFilterByDeck = async () => {
  if (!props.deck) return;

  let currentFilters = useNuxtApp().$deepClone(filters.value);

  if (currentFilters.filterByDeck) {
    currentFilters.filterByDeck = null;
  } else {
    currentFilters.filterByDeck = props.deck!.getId()
  }

  parsedFilters.value = currentFilters;

  clearTimeout(listReloadTrigger.value);
  listReloadTrigger.value = null;
  listReloadTrigger.value = setTimeout(() => {
    TableCoreRef.value.reload();
    clearTimeout(listReloadTrigger.value);
    listReloadTrigger.value = null;
  }, 600);
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

defineExpose({ openCardViewModal });
/**
 *
 *
 *
 *
 *
 * On Page Ready
 */
onNuxtReady(async () => {
  console.log('Starting page with colors', props.prefilterColors, mtgState.value.colors);
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
  <div class="app-mtg--card-list" v-if="ready">
    <div class="g-row card-list-headers">
      <div class="g-col --span-24">
        <div class="card-12-nm bg-color-black-mute border-radius-6">

          <app-table-header-actions
              :filters-component="shallowRef(LazyPageCardFilters)"
              v-model:filter="filters"
              v-model:string-search="parsedSearchText"
              :has-filters="!!parseHasFilters"
              title="Cards"
              @searched="handleSearch()"
              @reset-filters="handleResetFilters()"
          >
            <template #first-slot>
              <ul class="filter-group">
                <li class="margin-right-8">
                  <app-button-group>
                    <app-button
                        type="secondary"
                        size="sm"
                        class="padding-h-12"
                        :value="(((listItemsPerRow + 1) <= 10) ? (listItemsPerRow + 1) : 10)"
                        v-model="listItemsPerRow"
                        quick-click
                    >
                      <fa-icon :icon="['fas', 'magnifying-glass-minus']" />
                    </app-button>

                    <app-button
                        type="secondary"
                        size="sm"
                        class="padding-h-12"
                        :value="(((listItemsPerRow - 1) > 0) ? (listItemsPerRow - 1) : 1)"
                        v-model="listItemsPerRow"
                        quick-click
                    >
                      <fa-icon :icon="['fas', 'magnifying-glass-plus']" />
                    </app-button>
                  </app-button-group>
                </li>

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

            <template #last-slot>
              <div class="margin-left-8">
                <app-button
                    :type="filters.filterByDeck ? 'primary' : 'secondary'"
                    size="sm"
                    class="padding-h-12"
                    @click="toggleFilterByDeck()"
                >
                  view deck list
                </app-button>
              </div>
            </template>
          </app-table-header-actions>

        </div>
      </div>
    </div>

    <div class="g-row card-list-data">
      <div class="g-col --span-24">
        <app-table-core
            ref="TableCoreRef"
            :url="listUrl"
            :Entity="Card"
            :infinite="infinite"
            v-model:data="tableData"
            v-model:pagination="corePagination"
            v-model:loading="parseIsLoading"
            v-model:filters="parsedFilters"
            :primary-column="parsePrimaryColumn"
        >
          <app-list
              :table-data="tableData"
              :Entity="Card"
              :selected="selectedItems"
              :title="$_Tt('cards')"
              allow-filter
              hide-action-bar
              :infinite="infinite"
              :horizontal-scroll="horizontalScroll"
              :loading="parseIsLoading"
              :items-per-row="listItemsPerRow"
              :square-items="squareItems"
              v-model:pagination="parsedPagination"
              v-model:filter="parsedFilters"
              v-model:search="parsedSearchText"
              @select-all="handleSelectAll"
              @reset-filters="handleResetFilters()"
          >
            <template #app-list-item="{itemData}">
              <app-mtg-card
                  :card="itemData"
                  hide-descriptions
                  :square="squareItems"
                  @click="openCardViewModal(itemData)"
              >
                <template #indicator="{card}">
                  <slot name="indicator" :card="card"></slot>
                </template>
                <template #actions="{card}">
                  <slot name="actions" :card="card"></slot>
                </template>
              </app-mtg-card>
            </template>
            <template #app-list-item-skeleton>
              <p>No cards</p>
            </template>
          </app-list>
        </app-table-core>
      </div>
    </div>
  </div>
</template>