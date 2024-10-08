<script setup lang="ts">
import {EntityInterface} from "~/composables/entity/EntityInterface";
import {PaginationType} from "~/composables/customTypes/PaginationType";
import {AppTablePaginationType} from "~/composables/customTypes/AppTablePaginationType";
const route = useRoute();
const router = useRouter();

const emit = defineEmits([
  'fetching',
  'loaded',
  'update:data',
  'update:pagination',
  'update:loading',
  'update:search'
]);

const props = withDefaults(
    defineProps<{
      url: string,
      data: EntityInterface[],
      Entity: EntityInterface,
      primaryColumn?: {} | null,
      filters?:any,
      search?: string | null,
      pagination?: PaginationType | null,
      loading?: boolean,
      infinite?: boolean,
      noRouting?: boolean
    }>(),
    {
      primaryColumn: null,
      filters: null,
      search: null,
      pagination: {
        page: 1,
        pages: 1,
        pageSize: 10,
        total: 0,
        from: 0,
        to: 0
      },
      loading: false,
      infinite: false,
      noRouting: false
    }
);

const tableCoreUUID = ref('');
const currentlyLoading = ref(0);
const currentPagination:AppTablePaginationType = ref(null) as AppTablePaginationType;
const apiData = ref([]);
const searchTrigger: any = ref(null);
const requestTrigger:any = ref(null) as any;
const lastRequestHash:number|null = ref(null) as number|null;

async function goToNextPage() {
  if (currentPagination.value.page >= currentPagination.value.pages) return;
  currentPagination.value.page++;
  await runFetchData(false, true);
}

const runFetchData = async (force = false, appendItems = false) => {
  return new Promise((resolve, reject) => {
    if (!props.url) {
      reject('No URL');
      return;
    }
    if (currentlyLoading.value !== 0 && !force) {
      reject('OnGoing Request');
      return;
    }
    if (null !== requestTrigger.value) {
      reject('OnGoing Request found');
      return;
    }

    let params = {
      page: currentPagination.value.page,
      pageSize: currentPagination.value.pageSize,
      search: props.search,
      sort: null
    };

    if (null !== props.filters) {
      params.filters = props.filters;
    }

    const unreferenced = useNuxtApp().$deepClone(params);

    useStateHandler().startLoading();
    emit('fetching', true);
    emit('update:loading', true);

    const RequestUniqueId = btoa(props.url + JSON.stringify(unreferenced));

    if ((!appendItems && !props.infinite) || currentPagination.value.page === 1) {
      emit('update:data', []);
    }

    useLocalApiPost('/gatekeeper', {requestHash: RequestUniqueId})
        .then((reqControl) => {
          if (reqControl.success) {
            console.warn('CORE::running-request');
            useDynamicPost(props.url, unreferenced)
                .then((response) => {
                  if (response.success) {
                    let parsedData = [];

                    parsedData = response.data.results.map(i => {
                      return new props.Entity(i);
                    });

                    if ((!appendItems && !props.infinite) || currentPagination.value.page === 1) {
                      apiData.value = parsedData;
                    } else {
                      apiData.value = [...apiData.value, ...parsedData];
                    }

                    currentPagination.value.pages = response.data.pages;
                    currentPagination.value.count = response.data.count;
                    currentPagination.value.from = response.data.from;
                    currentPagination.value.to = response.data.to;
                    currentPagination.value.total = response.data.total;

                    emit('loaded', apiData.value);
                    emit('update:data', apiData.value);
                    emit('update:loading', false);

                    resolve('CORE: Loaded');
                  }
                })
                .catch((error) => {
                  emit('loaded', []);
                  emit('update:data', []);
                  emit('update:loading', false);
                  console.log('Table: request error', error);
                  reject('CORE: Failed');
                })
                .finally(() => {
                  useLocalApiPost(`/gatekeeper/${reqControl.requestId}`, {requestHash: RequestUniqueId})
                      .then(() => {
                        console.log('CORE: On Finally');
                        currentlyLoading.value = 0;
                        emit('update:pagination', currentPagination.value);
                      })
                });
          } else {
            console.error('Request refused by Gatekeeper', reqControl);
          }
        })
        .catch((e) => {
          console.log('Gatekeeper error:', e)
        })
  })
}

async function  toggleAllSelected() {
  let tData = [];

  if (props.url !== null && !!apiData?.value?.length) {
    tData = apiData?.value.map(row => `${row[primaryColumn.value.column ?? primaryColumn.value.name ?? 'id']}`);
  } else if (!!props.data?.length) {
    tData = props.data.map(row => `${row[primaryColumn.value.column ?? primaryColumn.value.name ?? 'id']}`);
  }

  let countCurrentSelection = tData.filter(i => currentSelectedRows.value.includes(i)).length;

  if (tData.length === countCurrentSelection) {
    // List already fully selected
    // So: removing the current list from selection
    currentSelectedRows.value = [...currentSelectedRows.value.filter(i => !tData.includes(i))];
  } else {
    // List not fully selected
    // So: adding the whole list to the selection
    currentSelectedRows.value = [...currentSelectedRows.value, ...tData.filter(i => !currentSelectedRows.value.includes(i))];
  }

  emit('selection-change', currentSelectedRows.value);
}

async function setSorting(data) {
  console.log('Table core: Sorting', data);
}

async function runSearch(data) {
  console.log('Table core: Running search', data);
}

const refresh = async (resetPagination = false) => {
  let force = false;
  let appendResults = props.infinite;

  currentPagination.value = useNuxtApp().$deepClone(props.pagination);

  if (resetPagination) {
    currentPagination.value.page = 1;
    appendResults = false;
  }

  await runFetchData(force, appendResults);
}

const abortRequest = () => {
  console.log('Aborting...');
}

defineExpose({ goToNextPage, toggleAllSelected, setSorting, runSearch, refresh, reload: refresh, abortRequest, abort: abortRequest });

onMounted(async () => {
  tableCoreUUID.value = `TABLE_CORE_${(Math.floor(Math.random() * 100) + 1)}_${Date.now()}`;
  currentPagination.value = useNuxtApp().$deepClone(props.pagination);

  if (!props.infinite) {
    if (route.query.hasOwnProperty('page') || route.query.hasOwnProperty('pageSize')) {
      if (route.query.hasOwnProperty('page')) {
        currentPagination.value.page = parseInt(route.query.page);
      }

      if (route.query.hasOwnProperty('pageSize')) {
        currentPagination.value.pageSize = parseInt(route.query.pageSize);
      }
    }
  } else if (route.query.hasOwnProperty('page')) {
    let params = {};

    if (route.query.hasOwnProperty('pageSize')) {
      params.pageSize = parseInt(route.query.pageSize);
      currentPagination.value.pageSize = parseInt(route.query.pageSize);
    }

    if (!props.noRouting) {
      await useRouter().replace({ path: useRoute().fullPath, force: true, query: params });
    }
  } else if (route.query.hasOwnProperty('pageSize')) {
    currentPagination.value.pageSize = parseInt(route.query.pageSize);
  }

  if (props.url) {
    await runFetchData();
  } else {
    currentPagination.value.pages = ((parseInt(props.data.length / currentPagination.value.pageSize)) + (props.data.length % currentPagination.value.pageSize ? 1 : 0));
    currentPagination.value.from = (((currentPagination.value.page - 1) * currentPagination.value.pageSize) + 1);
    currentPagination.value.to = (((currentPagination.value.page - 1) * currentPagination.value.pageSize) + props.data.filter((i, index) => {
      return ( (index >= ((currentPagination.value.page - 1) * currentPagination.value.pageSize)) && (index < (((currentPagination.value.page - 1) * currentPagination.value.pageSize) + currentPagination.value.pageSize)));
    }).length);
    currentPagination.value.total = props.data.length;
  }
});
</script>

<template>
  <slot></slot>
</template>