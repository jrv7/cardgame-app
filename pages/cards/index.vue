<script setup lang="ts">
import LazyPageCardDetails from '~/components/Pages/Card/Details';

const refCardsList = ref(null);
const modalHandler = useModal();
const listUrl = ref('/cards');
const columns = ref([
  { column: 'id', hidden: true, label: 'id', width: '48px', main: true},
  { column: 'cmc', label: 'cmc', searchable: true, dataType: 'string'},
  { column: 'manaCost', label: 'manaCost', searchable: true, dataType: 'string'},
  { column: 'name', label: 'name', width: '100%', searchable: true, dataType: 'string'}
]);
const selectedItems = ref([]);

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
                  if (fromChild) {
                    refCardsList.value.rebuild();
                  }

                  refCardsList.value.refresh();
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
</script>

<template>
  <div class="app-page--cards-list">
    <app-table
        ref="refCardsList"
        :url="listUrl"
        :columns="columns"
        :selected="selectedItems"
        :title="$_Tt('cards')"
        @select-all="handleSelectAll"
    >
      <template #head-column-actions="{rowData}">
        <fa-icon :icon="['fas', 'diamond']" />
      </template>

      <template #column_name="{rowData}">
        <div class="g-row">
          <div class="g-col --span-24">
            <div class="g-row">
              <div class="g-col --span-24">
                <span class="text-strong">
                  <a href="javascript: () => null" @click.prevent="openCardViewModal(rowData)">{{ rowData.name }}</a>
                  <!-- app-badge :value="rowData.uid" type="warning" size="sm" / -->
                </span>
              </div>
            </div>
            <div class="g-row">
              <div class="g-col --span-24">
                <span>{{ rowData.type }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>

    </app-table>
  </div>
</template>