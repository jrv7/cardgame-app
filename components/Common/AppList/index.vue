<script setup lang="ts">

import {EntityInterface} from "~/composables/entity/EntityInterface";
import {AppTableColumnType} from "~/composables/customTypes/AppTableColumnType";
import {AppTablePaginationType} from "~/composables/customTypes/AppTablePaginationType";

const emit = defineEmits(['update:filter', 'update:search', 'update:pagination', 'select-all', 'filtered', 'reset-filters']);
const loadingState = useLoadingState();
const tableKey = ref(1);

const props = withDefaults(
    defineProps<{
      tableData?: EntityInterface[] | null,
      columns?: AppTableColumnType[]|null,
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
      itemsPerRow?:number,
      squareItems?:boolean,
      horizontalScroll?:boolean,
      inline?:boolean,
      noSkeleton?:boolean
    }>(),
    {
      columns: null,
      allowSelection: true,
      allowQuickSearch: true,
      allowFilters: true,
      allowSubList: false,
      loading: false,
      defaultListSize: 10,
      title: null,
      filter: null,
      itemsPerRow: 5,
      squareItems: false,
      horizontalScroll: false,
      inline: false,
      noSkeleton: false
    }
);

const parsedPagination = computed({
  get: () => {
    return props.pagination
  },
  set: (value:AppTablePaginationType) => {
    emit('update:pagination', value);
  }
});

const parseData = computed(() => {
  return props.tableData;
})

const loadingRequest:any = ref(null);

const handleGoToPage = async (page, navigateNext = false) => {
  if (loadingRequest.value !== null) return;
  let currentPagination = useNuxtApp().$deepClone(parsedPagination.value);

  if (navigateNext) {
    page = (currentPagination.page + page);
  }

  if (page < 1 || page > currentPagination.pages || page === currentPagination.page) return;
  currentPagination.page = page;
  parsedPagination.value = currentPagination;
  // emit('update:pagination', currentPagination);
}

onNuxtReady(async () => {
  console.log('app-LIST built and ready');
})
</script>

<template>
  <div
      class="app-list"
      :class="{'square-items': squareItems, 'inline': inline}"
  >
    <div class="header">
    </div>

    <div class="body">
      <template v-if="horizontalScroll">
        <div class="scroll-nav scroll-nav-backwards">
          <app-button
              :disabled="pagination.page === 1"
              @click="handleGoToPage(-1, true)"
          >
            <fa-icon :icon="['fas', 'arrow-left']" />
          </app-button>
        </div>
      </template>

      <template v-for="(item, index) in parseData" :key="`app-list-item-${index}`">
        <div
            class="list-item"
            :class="[`item-size-${itemsPerRow}`]"
        >
          <div class="item-content">
            <slot name="app-list-item" :item-data="item" :item="index">
              <pre>{{ item }}</pre>
            </slot>
          </div>
        </div>
      </template>

      <template v-if="!noSkeleton" v-for="(nItem, index) in 1" :key="`app-list-item-skeleton-${index}`">
        <div
            class="list-item skeleton"
            :class="[`item-size-${itemsPerRow}`, {'invisible': !!parseData.length}]"
        >
          <div class="item-content">
            <slot name="app-list-item-skeleton">
              <pre>{{ nItem }}</pre>
            </slot>
          </div>
        </div>
      </template>

      <template v-if="horizontalScroll">
        <div class="scroll-nav scroll-nav-forwards">
          <app-button
              :disabled="pagination.page === pagination.pages"
              @click="handleGoToPage(1, true)"
          >
            <fa-icon :icon="['fas', 'arrow-right']" />
          </app-button>
        </div>
      </template>
    </div>

    <div class="footer" v-if="!horizontalScroll">
      <div class="app-table-pagination">
        <ul class="pagination-list" v-if="tableData.length && parsedPagination.total && parsedPagination.pages">
          <li>{{ $_Tt('showing') }} {{ tableData.length }} {{ $_tt('results') }} {{ $_tt('of') }} {{ parsedPagination.total }} | {{ $_Tt('from') }} {{ (((parsedPagination.page - 1) * parsedPagination.pageSize) + 1) }} {{ $_tt('to') }} {{ (((parsedPagination.page - 1) * parsedPagination.pageSize) + tableData.length) }}</li>
          <li class="spacer" />
          <li>
            <ul class="list-navigation">
<!--              <template v-if="parsedPagination.page !== 1">-->
<!--                <li class="spaced spaced-right">-->
<!--                  <app-button-icon-->
<!--                      type="link"-->
<!--                      size="sm"-->
<!--                      use-loading-state-->
<!--                      :loading="!!loadingRequest"-->
<!--                      @click="handleGoToPage(parsedPagination.page - 1)"-->
<!--                  >-->
<!--                    <fa-icon :icon="['fas', 'circle-chevron-left']" />-->
<!--                  </app-button-icon>-->
<!--                </li>-->
<!--                <li class="spaced">-->
<!--                  <app-button-->
<!--                      type="secondary"-->
<!--                      size="sm-squared"-->
<!--                      use-loading-state-->
<!--                      :loading="!!loadingRequest"-->
<!--                      @click="handleGoToPage(1)"-->
<!--                  >-->
<!--                    1-->
<!--                  </app-button>-->
<!--                </li>-->
<!--                <li class="spaced">-->
<!--                  <app-button-->
<!--                      type="link"-->
<!--                      size="sm-squared"-->
<!--                      disabled-->
<!--                  >-->
<!--                    ...-->
<!--                  </app-button>-->
<!--                </li>-->
<!--              </template>-->

<!--              <template v-for="btn in 3" :key="`navigation-next-button-${btn}`">-->
<!--                <li-->
<!--                    v-if="((parsedPagination.page - 4) + btn) > ((parsedPagination.page - 4) >= 1 ? (parsedPagination.page - 4) : 1)"-->
<!--                    class="spaced"-->
<!--                >-->
<!--                  <app-button-icon-->
<!--                      type="secondary"-->
<!--                      size="sm-squared"-->
<!--                      use-loading-state-->
<!--                      :loading="!!loadingRequest"-->
<!--                      @click="handleGoToPage(((parsedPagination.page - 4) + btn))"-->
<!--                  >-->
<!--                    {{ ((parsedPagination.page - 4) + btn) }}-->
<!--                  </app-button-icon>-->
<!--                </li>-->
<!--              </template>-->

<!--              <li-->
<!--                  class="spaced-left spaced-right"-->
<!--              >-->
<!--                <span class="d-flex margin-v-auto">{{ $_Tt('page') }} {{ parsedPagination.page }}</span>-->
<!--&lt;!&ndash;                <app-button-icon&ndash;&gt;-->
<!--&lt;!&ndash;                    type="link"&ndash;&gt;-->
<!--&lt;!&ndash;                    size="sm-squared"&ndash;&gt;-->
<!--&lt;!&ndash;                    disabled&ndash;&gt;-->
<!--&lt;!&ndash;                    :loading="!!loadingRequest"&ndash;&gt;-->
<!--&lt;!&ndash;                >&ndash;&gt;-->
<!--&lt;!&ndash;                  {{ $_Tt('page') }} {{ parsedPagination.page }}&ndash;&gt;-->
<!--&lt;!&ndash;                </app-button-icon>&ndash;&gt;-->
<!--              </li>-->

<!--              <template v-for="btn in 3" :key="`navigation-next-button-${btn}`">-->
<!--                <li-->
<!--                    v-if="(parsedPagination.page + btn) <= (parsedPagination.pages - 1)"-->
<!--                    class="spaced"-->
<!--                    @click="handleGoToPage((parsedPagination.page + btn))"-->
<!--                >-->
<!--                  <app-button-icon-->
<!--                      type="secondary"-->
<!--                      size="sm-squared"-->
<!--                      use-loading-state-->
<!--                      :loading="!!loadingRequest"-->
<!--                  >-->
<!--                    {{ (parsedPagination.page + btn) }}-->
<!--                  </app-button-icon>-->
<!--                </li>-->
<!--              </template>-->

              <template v-if="parsedPagination.page !== parsedPagination.pages">
<!--                <li class="spaced">-->
<!--                  <app-button-->
<!--                      type="link"-->
<!--                      size="sm-squared"-->
<!--                      disabled-->
<!--                  >-->
<!--                    ...-->
<!--                  </app-button>-->
<!--                </li>-->
<!--                <li class="spaced">-->
<!--                  <app-button-->
<!--                      type="secondary"-->
<!--                      size="sm-squared"-->
<!--                      use-loading-state-->
<!--                      :loading="!!loadingRequest"-->
<!--                      @click="handleGoToPage(parsedPagination.pages)"-->
<!--                  >-->
<!--                    >>{{ parsedPagination.pages }}-->
<!--                  </app-button>-->
<!--                </li>-->
                <li class="spaced spaced-left">
                  <app-button
                      type="link"
                      size="sm"
                      use-loading-state
                      :loading="!!loadingRequest"
                      @click="handleGoToPage(parsedPagination.page + 1)"
                  >
                    <span class="d-flex">
                      <span class="d-flex margin-v-auto margin-h-12">Load next</span> <fa-icon :icon="['fas', 'circle-chevron-right']" />
                    </span>
                  </app-button>
                </li>
              </template>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>