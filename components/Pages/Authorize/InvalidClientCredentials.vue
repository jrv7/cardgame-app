<script setup lang="ts">

import {UnwrapRef} from "vue";
import {AppMessageType} from "~/composables/customTypes/AppMessageType";

const errorMessages:Ref<UnwrapRef<AppMessageType[]>> = ref([
  {
    type: 'error',
    message: 'invalid_client_credentials_error_message'
  },
  {
    type: 'error',
    message: 'login_not_authorized_error_message'
  }
]);

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
  <form
      ref="refDataForm"
      id="frmAuthenticate"
      name="frmAuthenticate"
      action=""
      method="post"
  >
    <app-card
        class="grid --width-px-390"
        visible
    >
      <div class="g-row margin-auto text-align-center --width-px-390">
        <div class="g-col --span-8 margin-auto margin-top-24 margin-bottom-24">
          <img class="user-icon" src="~/assets/images/icons/user-icon-001.png">
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
    </app-card>
  </form>
</template>