<script setup lang="ts">

import {SimpleButtonSizeType} from "~/composables/customTypes/SimpleButtonTypes";
import {AppTableColumnType} from "~/composables/customTypes/AppTableColumnType";
import {AppTablePaginationType} from "~/composables/customTypes/AppTablePaginationType";
import {UnwrapRef} from "vue";
import {useLoadingState} from "~/composables/states";
import {EntityInterface} from "~/composables/entity/EntityInterface";
const refSelectAllCheckbox = ref(null);

const emit = defineEmits(['update:filter', 'update:search', 'update:pagination', 'select-all', 'filtered', 'reset-filters']);
const loadingState = useLoadingState();

const props = withDefaults(
    defineProps<{
      tableData?: EntityInterface[] | null,
      columns: AppTableColumnType[],
      pagination?:AppTablePaginationType|null,
      loading?: boolean,
      selected?: number[],
      allowSelection?:boolean,
      allowQuickSearch?:boolean,
      allowFilters?:boolean,
      allowSubList?:boolean,
      filtersComponent?:object,
      defaultListSize?:number,
      title?:string,
      filter?:any,
      hideActionBar?:boolean
    }>(),
    {
      allowSelection: true,
      allowQuickSearch: true,
      allowFilters: true,
      allowSubList: false,
      loading: false,
      defaultListSize: 10,
      title: null,
      filter: null,
      hideActionBar: false
    }
);

const visibleSubTables = ref([]);
const filters = ref(null);
const originalFilters = ref(null);
const parsedFilters = computed({
  get: () => {
    return props.filter || filters.value;
  },
  set: (value:any) => {
    filters.value = value;
    emit('update:filter', value);
  }
});

const pagination = ref({
  page: 1,
  pages: 1,
  pageSize: 10,
  from: 1,
  to: 1,
  count: 0,
  total: 0,
  filtered: false
}) as AppTablePaginationType;

const parsePagination = computed({
  get: () => {
    return props.pagination || pagination.value;
  },
  set: (value:AppTablePaginationType|null) => {
    pagination.value = value;
    emit('update:pagination', value);
  }
});

const stringSearch:string|null = ref(null) as string|null;
const searchTrigger:any = ref(null) as any;

const parseStringSearch = computed({
  get: () => {
    return stringSearch.value;
  },
  set: (value:string|null) => {
    stringSearch.value = value;

    searchTrigger.value = setTimeout(() => {
      emit('update:search', value);
      clearTimeout(searchTrigger.value);
      searchTrigger.value = null;
    }, 2000);
  }
});

const parsedColumns = computed(() => {
  return props.columns.filter(i => !i.hidden);
});

const sortedColumn:any = ref(null);

const mainColumn = computed(() => {
  return props.columns.find(i => !!i.main);
});

const parseSelected = computed(():array => {
  return props.selected ?? [];
});

const loadingRequest:any = ref(null);

const parseSearchable = computed(() => {
  return props.columns.filter(i => !!i.searchable).map(i => i.column);
});

const handleSelectAll = () => {
  let selected = [];

  if (refSelectAllCheckbox.value.checked) {
    if (mainColumn) {
      selected = props.tableData.map(i => {
        return i[mainColumn.value.column];
      });
    } else {
      console.log('No main column set');
    }
  }
  emit('select-all', selected);
}

const handleGoToPage = async (page) => {
  if (loadingRequest.value !== null) return;
  console.log('Going to page', page, parsePagination.value);
  if (page < 1 || page > parsePagination.value.pages || page === parsePagination.value.page) return;
  let currentPagination = useNuxtApp().$deepClone(parsePagination.value);
  currentPagination.page = page;
  emit('update:pagination', currentPagination);
}

const handleSort = async (col) => {
  if (loadingRequest.value !== null) return;

  if (!sortedColumn.value || sortedColumn.value.column !== col.column) {
    sortedColumn.value = useNuxtApp().$deepClone(col);
    sortedColumn.value.sort = useConsts().SORT_ORDER_NONE;
  }

  switch (sortedColumn.value.sort) {
    case useConsts().SORT_ORDER_DOWN: {
      sortedColumn.value.sort = useConsts().SORT_ORDER_UP;
    } break;

    case useConsts().SORT_ORDER_UP: {
      sortedColumn.value.sort = useConsts().SORT_ORDER_NONE;
    } break;

    default: {
      sortedColumn.value.sort = useConsts().SORT_ORDER_DOWN;
    } break;
  }

  await requestData();
}

const handleStringSearch = async () => {
  console.log('Searching', stringSearch.value);
  emit('update:search', stringSearch.value);
}

const handleFiltersApplied = async () => {
  let currentPagination = useNuxtApp().$deepClone(parsePagination.value);
  currentPagination.page = 1;
  emit('update:pagination', currentPagination);
  emit('update.filter', parsedFilters.value);
}
const handleResetFilters = () => {
  let currentPagination = useNuxtApp().$deepClone(parsePagination.value);
  currentPagination.page = 1;
  emit('update:pagination', currentPagination);
  emit('reset-filters', true);
}
const handleExpandRow = (row) => {
  if (!mainColumn) return;
  if (visibleSubTables.value.includes(row[mainColumn.value.column])) {
    visibleSubTables.value = visibleSubTables.value.filter(i => i !== row[mainColumn.value.column]);
  } else {
    visibleSubTables.value.push(row[mainColumn.value.column]);
  }
}

onNuxtReady(async () => {
  console.log('app-table built and ready');
  if (props.defaultListSize !== parsePagination.value.pageSize) {
    let currentPagination = useNuxtApp().$deepClone(parsePagination.value);
    currentPagination.pageSize = props.defaultListSize;
    parsePagination.value = currentPagination;
  }

  setTimeout(() => {
    originalFilters.value = useNuxtApp().$deepClone(props.filter);
  }, 200)

  sortedColumn.value = useNuxtApp().$deepClone(props.columns.find(i => !!i.sort && [useConsts().SORT_ORDER_UP, useConsts().SORT_ORDER_DOWN].includes(i.sort)));
});
</script>

<template>
  <div
      class="app-table"
      :class="{'loading': loading || loadingState.loading}"
  >
    <template v-if="!hideActionBar">
      <app-table-header-actions
          :allow-quick-search="allowQuickSearch"
          :allow-filters="allowFilters"
          :filters-component="filtersComponent"
          v-model:string-search="parseStringSearch"
          v-model:filter="parsedFilters"
          :has-filters="parsePagination.filtered"
          :title="title"
          @searched="handleStringSearch()"
          @filtered="handleFiltersApplied()"
          @reset-filters="handleResetFilters()"
      >
        <template #table-header-actions>
          <slot name="table-header-actions">
          </slot>
        </template>
        <template #first-slot>
          <slot name="table-header-actions-first-slot"></slot>
        </template>
      </app-table-header-actions>
    </template>

    <table cellspacing="0">
      <colgroup>
        <col width="4px">
        <template v-if="allowSelection">
          <col width="32px">
        </template>
        <template v-if="allowSubList">
          <col width="52px">
        </template>
        <template v-for="(col, cgIndex) in parsedColumns" :key="`t-colgroup-col-${cgIndex}`">
          <slot :name="`colgroup-${col.slot || col.column}`">
            <col :width="col.width">
          </slot>
        </template>
        <col width="4px">
      </colgroup>

      <thead>
        <tr>
          <th class="edge-spacer"></th>
          <template v-if="allowSelection">
            <th class="selector">
              <div class="cell">
                <input
                    ref="refSelectAllCheckbox"
                    type="checkbox"
                    @change="handleSelectAll()"
                >
              </div>
            </th>
          </template>
          <template v-if="allowSubList">
            <th class="t-head-col">
              <slot :name="`head-column-expand`">
                <div class="cell">
                  <slot :name="`head-column-expand_text`">
                    <fa-icon :icon="['fas', 'chevron-down']" />
                  </slot>
                </div>
              </slot>
            </th>
          </template>
          <template v-for="(col, hIndex) in parsedColumns" :key="`t-header-col-${hIndex}`">
            <th class="t-head-col" :data-thead-column="col.column">
              <slot :name="`head-column-${col.slot || col.column}`">
                <div class="cell">
                  <slot :name="`head-column-${col.slot || col.column}_text`">
                    {{ col.label ?? col.column }}
                  </slot>

                  <div class="sort" v-if="false !== col.sort">
                    <app-button-icon
                        type="link"
                        size="xs"
                        use-loading-state
                        @click="handleSort(col)"
                    >
                      <template v-if="col.dataType === 'string'">
                        <fa-icon :icon="['fas', ((sortedColumn && sortedColumn.column === col.column && sortedColumn.sort.length) ? (sortedColumn.sort === useConsts().SORT_ORDER_DOWN ? `arrow-down-a-z` : `arrow-down-z-a`) : 'sort')]" />
                      </template>
                      <template v-else>
                        <fa-icon :icon="['fas', ((sortedColumn && sortedColumn.column === col.column && sortedColumn.sort.length) ? (sortedColumn.sort === useConsts().SORT_ORDER_DOWN ? `arrow-down-1-9` : `arrow-down-9-1`) : 'sort')]" />
                      </template>
                    </app-button-icon>
                  </div>
                </div>
              </slot>
            </th>
          </template>
          <th>
            <div class="cell">
              <slot :name="`head-column-actions`">
                <slot :name="`head-column-actions_text`">
                  Actions
                </slot>
              </slot>
            </div>
          </th>
          <th class="edge-spacer"></th>
        </tr>
      </thead>

      <tbody>
        <template
            v-for="(row, rIndex) in tableData" :key="`table-body-row-${rIndex}`"
        >
          <slot name="data-row" :row-data="row">
            <slot :name="`row_${rIndex}`">
              <tr
                  :class="[`${((rIndex % 2) ? 'odd' : 'even')}-row`, {'open': visibleSubTables.includes(row.getData(mainColumn.column))}]"
              >
                <td class="edge-spacer"></td>
                <template v-if="allowSelection">
                  <td class="selector">
                    <div class="cell">
                      <input type="checkbox" :checked="mainColumn && parseSelected.length && parseSelected.includes(row.getData(mainColumn.column))">
                    </div>
                  </td>
                </template>
                <template v-if="allowSubList">
                  <td class="selector">
                    <div class="cell">
                      <app-button
                          type="link"
                          size="sm-squared"
                          @click="handleExpandRow(row)"
                      >
                        <fa-icon :icon="['fas', visibleSubTables.includes(row.getData(mainColumn.column)) ? 'chevron-up' : 'chevron-down']" />
                      </app-button>
                    </div>
                  </td>
                </template>
                <template v-for="(col, cIndex) in parsedColumns" :key="`table-body-row-${rIndex}-col-${cIndex}`">
                  <td>
                    <div class="cell">
                      <slot :name="`row_${rIndex+1}_column_${cIndex+1}`" :row-data="row">
                        <slot :name="`column_${cIndex+1}`" :row-data="row">
                          <slot :name="`column_${col.slot || col.column}`" :row-data="row">
                            <slot :name="`column_${col.slot || col.column}_text`">
                              {{ row.getData(col.column) }}
                            </slot>
                          </slot>
                        </slot>
                      </slot>
                    </div>
                  </td>
                </template>

                <td>
                  <div class="cell">
                    <slot :name="`row_${rIndex+1}_column_actions`" :row-data="row">
                      <slot :name="`column_actions`" :row-data="row">
                        Actions
                      </slot>
                    </slot>
                  </div>
                </td>
                <td class="edge-spacer"></td>
              </tr>

              <template v-if="visibleSubTables.includes(row.getData(mainColumn.column))">
                <tr class="sublist">
                  <td class="edge-spacer"></td>
                  <td :colspan="parsedColumns.length + 2">
                    <div class="cell">
                      <slot name="sub-table" :row-data="row"></slot>
                    </div>
                  </td>
                  <td class="edge-spacer"></td>
                </tr>
              </template>
            </slot>
          </slot>
        </template>
      </tbody>
    </table>

    <div class="app-table-pagination">
      <ul class="pagination-list" v-if="tableData.length && parsePagination.total && parsePagination.pages">
        <li>{{ $_Tt('showing') }} {{ tableData.length }} {{ $_tt('results') }} {{ $_tt('of') }} {{ parsePagination.total }} | {{ $_Tt('from') }} {{ (((parsePagination.page - 1) * parsePagination.pageSize) + 1) }} {{ $_tt('to') }} {{ (((parsePagination.page - 1) * parsePagination.pageSize) + tableData.length) }}</li>
        <li class="spacer" />
        <li>
          <ul class="list-navigation">
            <template v-if="parsePagination.page !== 1">
              <li class="spaced spaced-right">
                <app-button-icon
                    type="link"
                    size="sm"
                    use-loading-state
                    :loading="!!loadingRequest"
                    @click="handleGoToPage(parsePagination.page - 1)"
                >
                  <fa-icon :icon="['fas', 'circle-chevron-left']" />
                </app-button-icon>
              </li>
              <li class="spaced">
                <app-button
                    type="secondary"
                    size="sm-squared"
                    use-loading-state
                    :loading="!!loadingRequest"
                    @click="handleGoToPage(1)"
                >
                  1
                </app-button>
              </li>
              <li class="spaced">
                <app-button
                    type="link"
                    size="sm-squared"
                    disabled
                >
                  ...
                </app-button>
              </li>
            </template>

            <template v-for="btn in 3" :key="`navigation-next-button-${btn}`">
              <li
                  v-if="((parsePagination.page - 4) + btn) > ((parsePagination.page - 4) >= 1 ? (parsePagination.page - 4) : 1)"
                  class="spaced"
              >
                <app-button-icon
                    type="secondary"
                    size="sm-squared"
                    use-loading-state
                    :loading="!!loadingRequest"
                    @click="handleGoToPage(((parsePagination.page - 4) + btn))"
                >
                  {{ ((parsePagination.page - 4) + btn) }}
                </app-button-icon>
              </li>
            </template>

            <li
                class="spaced-left spaced-right"
            >
              <app-button-icon
                  type="link"
                  size="sm-squared"
                  disabled
                  :loading="!!loadingRequest"
              >
                {{ $_Tt('page') }} {{ parsePagination.page }}
              </app-button-icon>
            </li>

            <template v-for="btn in 3" :key="`navigation-next-button-${btn}`">
              <li
                  v-if="(parsePagination.page + btn) <= (parsePagination.pages - 1)"
                  class="spaced"
                  @click="handleGoToPage((parsePagination.page + btn))"
              >
                <app-button-icon
                    type="secondary"
                    size="sm-squared"
                    use-loading-state
                    :loading="!!loadingRequest"
                >
                  {{ (parsePagination.page + btn) }}
                </app-button-icon>
              </li>
            </template>

            <template v-if="parsePagination.page !== parsePagination.pages">
              <li class="spaced">
                <app-button
                    type="link"
                    size="sm-squared"
                    disabled
                >
                  ...
                </app-button>
              </li>
              <li class="spaced">
                <app-button
                    type="secondary"
                    size="sm-squared"
                    use-loading-state
                    :loading="!!loadingRequest"
                    @click="handleGoToPage(parsePagination.pages)"
                >
                  >>{{ parsePagination.pages }}
                </app-button>
              </li>
              <li class="spaced spaced-left">
                <app-button
                    type="link"
                    size="sm"
                    use-loading-state
                    :loading="!!loadingRequest"
                    @click="handleGoToPage(parsePagination.page + 1)"
                >
                  <fa-icon :icon="['fas', 'circle-chevron-right']" />
                </app-button>
              </li>
            </template>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>