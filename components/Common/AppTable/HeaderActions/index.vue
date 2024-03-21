<script setup lang="ts">

import {AppModalType} from "~/composables/customTypes/ModalTypes";
import LazyPageSessionDetails from "~/components/Pages/Session/Details/index.vue";
import {AppTableColumnType} from "~/composables/customTypes/AppTableColumnType";
import {filter} from "domutils";

const emit = defineEmits(['update:string-search', 'update:filter', 'searched', 'filtered', 'reset-filters']);

const props = withDefaults(
    defineProps<{
      allowQuickSearch?:boolean,
      allowFilters?:boolean,
      filter?:any,
      hasFilters?:boolean,
      filtersComponent?:any,
      stringSearch?:string,
      title?:string
    }>(),
    {
      allowQuickSearch: true,
      allowFilters: true,
      filter: null,
      hasFilters: false,
      stringSearch: null,
      title: null
    }
);

const modalHandler = useModal();
const searchedString = computed({
  get: () => {
    return props.stringSearch;
  },
  set: (value:string) => {
    emit('update:string-search', value);
  }
});
const parsedFilters = computed({
  get: () => {
    return props.filter;
  },
  set: (val:any) => {
    emit('update:filter', val);
  }
});

const clearStringSearch = () => {
  searchedString.value = null;
  emit('searched');
}

const handleFilters = () => {
  const filtersModal:AppModalType = modalHandler.getDefault();
  filtersModal.title = `${props.title}${props.title ? ' ' : ''}filters`
  filtersModal.component = props.filtersComponent;
  filtersModal.componentData = {
    filter: parsedFilters,
    hasFilters: props.hasFilters
  };
  filtersModal.noPadding = true;
  filtersModal.type = 'full-left';
  filtersModal.icon = ['fas', 'filter'];
  filtersModal.buttons = {
    confirm: {
      type: 'primary',
      size: 'sm',
      text: useNuxtApp().$_Tt('apply_filters')
    },
    cancel: props.hasFilters ? {
      type: 'warning',
      size: 'sm',
      text: useNuxtApp().$_Tt('clear_filters')
    } : true,
    close: true
  }
  filtersModal.onFinish = async (modalData) => {
    return new Promise((resolve, reject) => {
      emit('update:filter', modalData);
      emit('filtered', true);

      setTimeout(() => {
        resolve(true);
      }, 200);
    })
  }
  filtersModal.onCancel = async (modalData) => {
    return new Promise((resolve, reject) => {
      emit('reset-filters', true);

      setTimeout(() => {
        resolve(true);
      }, 400);
    })
  }
  modalHandler.set(filtersModal);
  modalHandler.show(filtersModal);
}
</script>

<template>
  <div class="table-header-action-bar">
    <slot name="table-header-actions">
      <ul class="header-list">
        <li>
          <slot name="first-slot"></slot>
        </li>
        <li class="spacer" />
        <li style="width: 200px">
          <template v-if="allowQuickSearch">
            <app-input
                size="sm"
                :label="false"
                left-icon="search"
                right-icon="xmark"
                v-model="searchedString"
                :placeholder="$_Tt('search')"
                @keydown.enter="$emit('searched')"
            >
              <template #right-icon>
                <app-button-icon
                    type="link"
                    size="sm"
                    class="margin-left-auto margin-right-0"
                    @click="clearStringSearch()"
                >
                  <fa-icon :icon="['fas', 'xmark']" />
                </app-button-icon>
              </template>
            </app-input>
          </template>
        </li>
        <li class="separator" />
        <li>
          <template v-if="allowQuickSearch">
            <app-button-icon
                :type="hasFilters ? 'primary' : 'link'"
                size="square-xs"
                @click="handleFilters()"
            >
              <fa-icon :icon="['fas', 'filter']" />
            </app-button-icon>
          </template>
        </li>
      </ul>
    </slot>
  </div>
</template>