<script setup lang="ts">
const props = withDefaults(
    defineProps<{
      message?:string,
      middleMessage?:string,
    }>(),
    {
      message: null,
      middleMessage: null
    }
);

const parseModalValue = async () => {
  return new Promise((resolve) => {
    resolve(true);
  })
}

defineExpose({ parseModalValue });
</script>

<template>
  <div class="app-system-prompt-confirmation-message">
    <span class="prompt-message" v-html="message" />
    <span class="prompt-message" v-if="!!middleMessage" v-html="middleMessage" />
    <hr>
    <span class="prompt-message">
      {{ $_Tt('are_you_sure') }}
    </span>
  </div>
</template>