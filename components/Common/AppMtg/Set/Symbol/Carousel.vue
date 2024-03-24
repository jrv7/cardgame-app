<script setup lang="ts">
import {CollectionSet} from "~/composables/entity/CollectionSet";

const emit = defineEmits(['update:modelValue', 'click']);
const props = withDefaults(
    defineProps< {
      modelValue:CollectionSet|null,
      sets:CollectionSet[],
      loading?:boolean
    }>(), {
      modelValue: null,
      loading: false
    });

const parseActiveSet = computed({
  get: () => {
    return props.modelValue
  },
  set: (value:CollectionSet|null) => {
    emit('update:modelValue', value);
  }
});

const isLoading = computed(() => {
  return props.loading;
});

const changeCollectionSet = (set:CollectionSet) => {
  parseActiveSet.value = set;
}

</script>

<template>
  <ul class="app-mtg-set-symbol-carousel">
    <template v-for="(set, index) in sets" :key="`car-collection-set-item-${index}`">
      <li>
        <app-mtg-set-symbol
            :value="set.getCode()"
            :rarity="set.getId() === parseActiveSet?.getId() ? 'mythic' : 'uncommon'"
            :name="set.getName()!"
            :loading="!!isLoading"
            can-hover
            @click="changeCollectionSet(set)"
        />
      </li>
    </template>
  </ul>
</template>