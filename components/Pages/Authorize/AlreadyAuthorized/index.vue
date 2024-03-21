<script setup lang="ts">

import {AppMessageType} from "~/composables/customTypes/AppMessageType";
import {UnwrapRef} from "vue";

const errorMessages:Ref<UnwrapRef<AppMessageType[]>> = ref([]);

const parsedMessages = computed(() => {
  if (!errorMessages.value) return [];

  return errorMessages.value.map(i => {
    i.id = useNuxtApp().$_hash(`${i.type}-${i.message || i.text}`);

    return i;
  });
});

const handleRemoveMessage = (msg:AppMessageType) => {
  errorMessages.value = parsedMessages.value.filter(i => i.id !== msg.id);
}
</script>

<template>
  <app-card
      class="grid --width-px-390"
      visible
  >
    <div class="g-row margin-auto text-align-center --width-px-390"><div class="g-col">&nbsp;</div></div>

    <div class="g-row margin-auto text-align-center --width-px-390">
      <div class="g-col --span-23">
        <span class="text-px-18 --txt-color-dark-gray" v-html="$_Tt('auth_authorized_greeting_message')" />
      </div>
    </div>

    <div class="g-row margin-auto text-align-center --width-px-390"><div class="g-col">&nbsp;</div></div>

    <div class="g-row margin-auto text-align-center --width-px-390">
      <div class="g-col --span-8 margin-auto margin-top-24 margin-bottom-24">
        <img class="user-icon" src="~/assets/images/icons/authorized.png">
      </div>
    </div>

    <template v-if="parsedMessages.length">
      <div class="g-row margin-auto text-align-center --width-px-390"><div class="g-col">&nbsp;</div></div>

      <template
          v-for="msg in parsedMessages" :key="msg"
      >
        <div class="g-row margin-auto text-align-center --width-px-390 margin-top-6">
          <div class="g-col">
            <app-card-message
                :message="msg"
                @removed="handleRemoveMessage(msg)"
            />
          </div>
        </div>
      </template>
    </template>

    <div class="g-row margin-auto text-align-center --width-px-390 margin-top-6"><div class="g-col">&nbsp;</div></div>

    <div class="g-row margin-auto text-align-center --width-px-390">
      <app-button
          type="warning"
      >{{ $_TT('exit') }}</app-button>
    </div>
  </app-card>
</template>