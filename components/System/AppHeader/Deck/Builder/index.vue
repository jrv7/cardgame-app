<script setup lang="ts">
import {DeckInterface} from "~/composables/entity/DeckInterface";

const {locales, locale, setLocale} = useI18n();
const route = useRoute();
const router = useRouter();
</script>

<template>
  <div class="system-header-deck-builder">
    <ul class="header-list">
      <li class="separator" />

      <li>
        <span>Deck: </span>
      </li>

      <li class="separator invisible" />
    </ul>
  </div>
</template>