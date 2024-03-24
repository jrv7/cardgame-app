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
      filter?:any
    }>(),
    {
      allowSelection: true,
      allowQuickSearch: true,
      allowFilters: true,
      allowSubList: false,
      loading: false,
      defaultListSize: 10,
      title: null,
      filter: null
    }
);

const parseData = computed(() => {
  return props.tableData;
})
</script>

<template>
  <div class="app-list">
    <div class="header">
      <span>Header</span>
    </div>

    <div class="body">
      <template v-for="(item, index) in parseData" :key="`app-list-item-${index}`">
        <div class="list-item">
          <div class="item-content">
            <slot name="app-list-item" :item-data="item" :item="index">
              <pre>{{ item }}</pre>
            </slot>
          </div>
        </div>
      </template>
    </div>

    <div class="footer"></div>
  </div>
</template>