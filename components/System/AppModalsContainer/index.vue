<script setup lang="ts">
const modalState = useModalState();

const parsedModals = computed(() => {
  return modalState.value ?? [];
})
</script>

<template>
  <div class="app-modals-container">
    <template v-for="(modal, mIndex) in parsedModals" :key="`modal-${mIndex}-${modal.id}`">
      <app-modal
          v-bind="modal"
          :style="{'z-index': (1100 + mIndex)}"
      />
    </template>
  </div>
</template>