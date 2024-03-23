<script setup lang="ts">

import {CollectionSetInterface} from "~/composables/entity/CollectionSetInterface";
import {CollectionSet} from "~/composables/entity/CollectionSet";
import {Card} from "~/composables/entity/Card";
import {useNuxt} from "@nuxt/kit";

const emit = defineEmits(['update:modelValue']);
const collectionSetTableCoreRef = ref(null);

const props = withDefaults(
    defineProps<{
      filter?:any
    }>(),
    {
      filter: null
    }
);

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

const collectionSetPagination = ref({
  page: 1,
  pages: 1,
  pageSize: 54,
  total: 0,
  from: 1,
  to:10,
  search: null
});
const collectionSetSearch:string|null = ref(null) as string|null;
const parseCollectionSetSearch = computed({
  get: () => {
    return collectionSetSearch.value;
  },
  set: (value:string|null) => {
    collectionSetSearch.value = value;
  }
});

const CollectionSetEntity = new CollectionSet();
const parseCollectionSetPrimaryCol = computed(() => {
  return CollectionSetEntity.getPrimary();
});

const isReady = ref(false);
const collectionSetsList:CollectionSetInterface[] = ref([]) as CollectionSetInterface[];
const prefilteredCollectionSetList:CollectionSetInterface[] = ref([]) as CollectionSetInterface[];
const parseOptions = computed(() => {
  return [
    {
      name: 'simpleSearch',
      title: useNuxtApp().$_Tt('search'),
      description: useNuxtApp().$_Tt('card_details_filter_simple_search_field_description'),
      open: false
    },
    {
      name: 'collectionSets',
      title: useNuxtApp().$_Tt('collection_sets'),
      description: useNuxtApp().$_Tt('card_details_filter_collection_sets_field_description'),
      open: true
    },
    {
      name: 'types',
      title: useNuxtApp().$_Tt('types'),
      description: useNuxtApp().$_Tt('filter_cards_types_description'),
      open: false
    },
    {
      name: 'subtypes',
      title: useNuxtApp().$_Tt('subtypes'),
      description: useNuxtApp().$_Tt('filter_cards_subtypes_description'),
      open: false
    },
    {
      name: 'supertypes',
      title: useNuxtApp().$_Tt('supertypes'),
      description: useNuxtApp().$_Tt('filter_cards_supertypes_description'),
      open: false
    }
  ].map((i, index) => {
    return {
      id: index + 1,
      ...i
    }
  });
});

const filters:any = ref({
  simpleSearch: null,
  collectionsSets: []
});

const selectedSets = ref([]);

const parsedSimpleSearch = computed(() => {
  return [
    ...filters.value.simpleSearch.filter(i => i.comparator === '1'),
    ...filters.value.simpleSearch.filter(i => i.comparator !== '1')
  ]
});

const comparator = ref(1);
const simpleTextSearch:string|null = ref(null) as string|null;
const searchCompare = computed({
  get: () => {
    return comparator.value;
  },
  set: (val:number) => {
    comparator.value = val;
  }
});

const handleCollectionSetSearch = () => {
  console.log('Settings collection search', collectionSetSearch.value);
  collectionSetPagination.value.search = collectionSetSearch.value;
}

const handleSimpleSearch = async () => {
  const pieces = simpleTextSearch.value.split(',');
  let inserted = false;
  await pieces.forEach(i => {
    if (!filters.value.simpleSearch.filter(j => j.comparator === `${comparator.value}` && j.text.toLowerCase() === i.trim().toLowerCase()).length) {
      filters.value.simpleSearch.push({ comparator: `${comparator.value}`, text: i.trim() });
      inserted = true;
    }
  });

  if (inserted) {
    simpleTextSearch.value = null;
  }
}

const handleSearchDelete = (t) => {
  const foundElement = filters.value.simpleSearch.find(i => i.comparator === t.comparator && i.text.toLowerCase() === t.text.toLowerCase());
  if (foundElement) {
    filters.value.simpleSearch = filters.value.simpleSearch.filter(i => i !== foundElement);
  }
}

const handleSetSelect = (setId:number) => {
  if (filters.value.collectionsSets?.includes(setId)) {
    filters.value.collectionsSets = filters.value.collectionsSets.filter(i => i !== setId);
  } else {
    filters.value.collectionsSets.push(setId);
  }
}

const parseModalValue = async () => {
  return new Promise((resolve) => {
    resolve(filters.value);
  });
}

const loadMoreCollectionSets = async () => {
  collectionSetTableCoreRef.value.goToNextPage();
}

defineExpose({
  parseModalValue
});

onNuxtReady(async () => {
  await new Promise((resolve) => {
    if (null !== props.filter) {
      filters.value = useNuxtApp().$deepClone(props.filter);
    }

    if (filters.value.collectionsSets.length) {
      let filteredHeader = useNuxtApp().$deepClone(collectionSetPagination.value)
      filteredHeader.filters = filters.value;
      filteredHeader.pageSize = filters.value.collectionsSets.length;

      useDynamicPost('/sets', filteredHeader)
          .then((response) => {
            if (response.success) {
              prefilteredCollectionSetList.value = response.data.results.map(i => {
                return new CollectionSet(i);
              });
            }
            resolve();
          })
    } else {
      resolve();
    }
  })
      .then(() => {
        setTimeout(() => {
          isReady.value = true;
        }, 200)
      })
})
</script>

<template>
  <div class="app-page--subpage-card-filters-page" v-if="isReady">
    <div class="g-row max-width">
      <div class="g-col --span-24">
        <div class="g-row max-width">
          <div class="g-col --span-24">
            <app-accordion
                :options="parseOptions"

            >
              <template #container-simpleSearch>
                <div class="g-row max-width margin-top-12">
                  <div class="g-col --span-24">

                    <div class="g-row max-width">
                      <div class="g-col --span-24">
                        <app-button-group>
                          <app-button
                              type="link"
                              size="sm"
                              readonly
                              class="padding-right-8"
                          >
                            {{ $_Tt('name') }}
                          </app-button>
                          <app-button-select
                              type="secondary"
                              size="sm-squared"
                              position="bottom-left"
                          >
                            <template #button-slot>
                          <span>
                            <fa-icon :icon="['fas', (searchCompare === 1 ? 'equals' : 'not-equal')]" />
                          </span>
                            </template>

                            <app-card
                                class="--width-px-200 padding-v-8"
                                visible
                            >
                              <ul class="options-list">
                                <li>
                                  <app-button
                                      type="link"
                                      size="sm"
                                      align-text="left"
                                      :value="1"
                                      v-model="searchCompare"
                                  >{{ $_Tt('same_or_similar') }}</app-button>
                                </li>
                                <li>
                                  <app-button
                                      type="link"
                                      size="sm"
                                      align-text="left"
                                      :value="2"
                                      v-model="searchCompare"
                                  >{{ $_Tt('different') }}</app-button>
                                </li>
                              </ul>
                            </app-card>
                          </app-button-select>

                          <app-input
                              size="sm"
                              v-model="simpleTextSearch"
                              :placeholder="$_Tt('search')"
                              left-icon="envelope"
                              @keydown.enter="handleSimpleSearch()"
                          />
                        </app-button-group>
                      </div>
                    </div>

                    <div class="g-row max-width margin-top-6">
                      <div class="g-col --span-24 app-label-container">
                        <template v-for="(t, index) in parsedSimpleSearch" :key="`searched-text-${t.comparator}-${index}`">
                          <app-label
                              :icon="t.comparator === '1' ? 'equals' : 'not-equal'"
                              @delete="handleSearchDelete(t)"
                          >
                            {{ t.text.substr(0, 32) + (t.text.length > 32 ? '...' : '') }}
                          </app-label>
                        </template>
                      </div>
                    </div>

                  </div>
                </div>
              </template>

              <template #container-collectionSets>
                <div class="g-row max-width margin-top-12">
                  <div class="g-col --span-24">

                    <div class="g-row max-width">
                      <div class="g-col --span-24">
                        <app-table-core
                            ref="collectionSetTableCoreRef"
                            url="/sets"
                            :Entity="CollectionSet"
                            v-model:data="collectionSetsList"
                            v-model:pagination="collectionSetPagination"
                            v-model:loading="parseIsLoading"
                            v-model:search="parseCollectionSetSearch"
                            :primary-column="parseCollectionSetPrimaryCol"
                        >
                          <ul class="collection-set-filter-list">
                            <li class="list-search">
                              <app-input
                                  size="sm"
                                  v-model="parseCollectionSetSearch"
                                  @submitted="handleCollectionSetSearch"
                              />
                            </li>

                            <template v-for="(colSetSelected, index) in prefilteredCollectionSetList" :key="`collection-set-filters-list-item-${index}`">
                              <li>
                                <input
                                    type="checkbox"
                                    :id="`filter-collection-set-${colSetSelected.getId()}`"
                                    name="collection_set[]"
                                    :value="colSetSelected.getId()"
                                    :checked="filters.collectionsSets?.includes(colSetSelected.getId())"
                                    @change="handleSetSelect(colSetSelected.getId())"
                                >
                                <label
                                    class="set-icon"
                                    :for="`filter-collection-set-${colSetSelected.getId()}`"
                                >
                                  <app-mtg-set-symbol
                                      v-if="colSetSelected.getCode() !== null"
                                      :value="colSetSelected.getCode()"
                                      :rarity="filters.collectionsSets?.includes(colSetSelected.getId()) ? 'mythic' : 'uncommon'"
                                      :name="colSetSelected.getName()"
                                  />
                                </label>
                                <span class="set-name">{{ colSetSelected.getName() }}</span>
                              </li>
                            </template>

                            <template v-if="prefilteredCollectionSetList.length" key="collection-set-filters-list-item-separator">
                              <li class="separator"></li>
                            </template>

                            <template v-for="(colSet, index) in collectionSetsList" :key="`collection-set-filters-list-item-${index}`">
                              <li>
                                <input
                                    type="checkbox"
                                    :id="`filter-collection-set-${colSet.getId()}`"
                                    name="collection_set[]"
                                    :value="colSet.getId()"
                                    :checked="filters.collectionsSets?.includes(colSet.getId())"
                                    @change="handleSetSelect(colSet.getId())"
                                >
                                <label
                                    class="set-icon"
                                    :for="`filter-collection-set-${colSet.getId()}`"
                                >
                                  <app-mtg-set-symbol
                                      v-if="colSet.getCode() !== null"
                                      :value="colSet.getCode()"
                                      :rarity="filters.collectionsSets?.includes(colSet.getId()) ? 'mythic' : 'uncommon'"
                                      :name="colSet.getName()"
                                  />
                                </label>
                                <span class="set-name">{{ colSet.getName() }}</span>
                              </li>
                            </template>

                            <li
                                v-if="collectionSetPagination.page < collectionSetPagination.pages"
                                class="btn-load-more"
                            >
                              <app-button
                                  type="link"
                                  size="sm"
                                  @click="loadMoreCollectionSets()"
                              >
                                <span class="d-flex">
                                  <span class="margin-v-auto margin-h-4 padding-top-1">
                                    <fa-icon :icon="['fas', 'arrow-down']" />
                                  </span>
                                  <span class="margin-v-auto">Load more</span>
                                </span>
                              </app-button>
                            </li>
                          </ul>
                        </app-table-core>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </app-accordion>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>