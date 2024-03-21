<script setup lang="ts">

import {AppAccordionOptionType} from "~/composables/customTypes/AppAccordionOptionType";

const props = withDefaults(
    defineProps<{
      options:AppAccordionOptionType[],
      autoCollapse?:boolean
    }>(),
    {
      autoCollapse: false
    }
);

const openItems = ref([]);

const clickTrigger:any = ref(null);
const handleItemCLick = (item:AppAccordionOptionType) => {
  if (null !== clickTrigger.value) return;
  clickTrigger.value = true;
  let hasOpenItems = false;

  if (openItems.value.includes(item.id)) {
    openItems.value = openItems.value.filter(i => i !== item.id);
    clickTrigger.value = null;
    return;
  } else if (props.autoCollapse) {
    hasOpenItems = !!openItems.value.length
    openItems.value = [];
  }

  setTimeout(() => {
    openItems.value.push(item.id);
    clickTrigger.value = null;
  }, hasOpenItems ? 350 : 50);
}

onNuxtReady(() => {
  openItems.value = props.options.filter(i => !!i.default || !!i.open).map(i => i.id);
})
</script>

<template>
  <div class="app-accordion">
    <ul class="accordion-list">
      <template v-for="(opt, index) in options" :key="`accordion-item-${index}`">
        <li
            :class="{'open': openItems.includes(opt.id)}"
        >
          <div
              class="accordion-item"
              @click="handleItemCLick(opt)"
          >
            <div class="texts">
              <span class="title">{{ opt.title }}</span>
              <span class="description" v-if="opt.description">{{ opt.description }}</span>
            </div>

            <span class="indicator-icon">
              <fa-icon :icon="['fas', openItems.includes(opt.id) ? 'chevron-up' : 'chevron-down']" />
            </span>
          </div>

          <div class="accordion-container">
            <slot :name="`container-${opt.name}`"></slot>
          </div>
        </li>
      </template>
    </ul>
  </div>
</template>