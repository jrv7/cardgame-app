<script setup lang="ts">

const localePath = useLocalePath();
const {locales, locale, setLocale} = useI18n();

</script>

<template>
  <div class="system-header">
    <div class="header-logo">&nbsp;</div>
    <span class="message-txt text-size-sm">{{ $_TT('connection') }}</span>

    <div class="header-actions-container g-row  text-align-center --width-px-52">
      <div class="g-col --span-23">
        <app-button-select
            type="secondary"
            size="square-sm"
            class="margin-v-auto margin-left-auto margin-right-4"
        >
          <template #button-slot>
            <span>
              <fa-icon :icon="['fas', 'language']" />
            </span>
          </template>

          <app-card
              class="--width-px-200 padding-v-8"
              visible
          >
            <ul class="languages-list">
              <template v-for="lang in locales" :key="lang">
                <li>
                  <span class="flag-icon">
                    <img :src="`/media/icons/language/country-flag-${lang.code}.png`" :alt="`language-${lang.code}`">
                  </span>
                  <app-button
                      type="link"
                      size="sm"
                      align-text="left"
                      class="lang-name"
                      :disabled="lang.code === locale"
                      @click="setLocale(lang.code)"
                  >{{ $_Tt(lang.code) }}</app-button>
                </li>
              </template>
            </ul>
          </app-card>
        </app-button-select>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>