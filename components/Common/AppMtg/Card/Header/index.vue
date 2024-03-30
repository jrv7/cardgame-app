<script setup lang="ts">

import {SimpleButtonSizeType, SimpleButtonTypeType} from "~/composables/customTypes/SimpleButtonTypes";
import {CardInterface} from "~/composables/entity/CardInterface";

const props = withDefaults(
    defineProps<{
      card:CardInterface
    }>(), {
    }
);
</script>

<template>
  <div class="app-mtg-card-header">
    <div class="name">
      <span>{{ card.getName() }}</span>
    </div>
    <div class="cost">
      <span>{{ card.getManaCost() }}</span>
    </div>
  </div>
</template>