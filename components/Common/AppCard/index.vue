<script setup lang="ts">

const props = withDefaults(
    defineProps<{
      visible?:boolean,
      loading?:boolean
    }>(), {
      visible: false,
      loading: false
    }
);
</script>

<template>
  <div
      class="app-card"
      :class="{'visible': visible, 'is-loading': loading }"
  >
    <slot></slot>

    <div class="loader">
      <span>
        <span class="text-size-huge"><fa-icon :icon="['fas', 'spinner']" spin /></span>
        <span class="margin-top-8">{{ $_Tt('loading') }}</span>
      </span>
    </div>
  </div>
</template>
