<script setup lang="ts">
import {GameSessionType} from "~/composables/customTypes/GameSessionType";

const emit = defineEmits(['update:session']);
const props = withDefaults(
    defineProps<{
      gameUid:string,
    }>(), {
    }
);

const interactionCounter = ref(0);

const Observe = async () => {
  return new Promise((resolve, reject) => {
    useLocalApiPost(`/session/${props.gameUid}/observe`)
        .then((response) => {
          if (response.interactionCounter !== interactionCounter.value) {
            interactionCounter.value = response.interactionCounter;
            emit('update:session', response);
          }
          resolve(response);

          // setTimeout(() => {
          //   Observe();
          // }, 1000);
        })
  })
}

defineExpose({ Observe });

onBeforeMount(async () => {
  // await Observe();
})
</script>

<template>
  <slot></slot>
</template>