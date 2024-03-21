<script setup lang="ts">
definePageMeta({
  middleware: [
      'oauth2-authorize',
      'redirect-control'
  ]
});

import LazyAuthorizeForm from "~/components/Pages/Authorize/Form";
import LazyAuthorizeSmsConfirmation from "~/components/Pages/Authorize/SmsConfirmation";
import LazyAuthorizeAlreadyAuthorized from "~/components/Pages/Authorize/AlreadyAuthorized";
import InvalidClientCredentials from "~/components/Pages/Authorize/InvalidClientCredentials.vue";
import {AppMessageType} from "~/composables/customTypes/AppMessageType";

const route = useRoute();
const clientState = useOauthState;
const oauthHandler = useOauthServerHandler();

const errorMessages:Ref<UnwrapRef<AppMessageType[]>> = ref([]);

const clientData = computed(() => {
  return clientState().value.client;
})

const formData = ref({ email: null, password: null, validationCode: null });

const visibleComponent = ref('loginForm');
const isLoading = ref(true);

const pageComponent = computed(() => {
  if (clientState().value.client === null) return InvalidClientCredentials;

  switch (parseInt(clientState().value.client?.sessionState)) {
    case 2:
      return LazyAuthorizeSmsConfirmation;

    case 1:
      return LazyAuthorizeAlreadyAuthorized;

    default:
      return LazyAuthorizeForm;
  }
});

const setComponent = (comp:string) => {
  visibleComponent.value = comp;

  setTimeout(() => {
    isLoading.value = false;
  }, 1000);
}

const handleFormSubmit = ():boolean => {
  if (clientState().value.client === null) return false;
  isLoading.value = true;

  switch (visibleComponent.value) {
    case '2fs': {
      oauthHandler.doCodeValidation(formData.value)
          .then((response) => {
            setTimeout(() => {
              isLoading.value = false;
            }, 600);
          })
          .catch((errors) => {
            errorMessages.value.push({ type: 'error', message: errors.message });
            setTimeout(() => {
              isLoading.value = false;
            }, 600);
          });
    } break;

    case 'loginForm': {
      oauthHandler.doLogin(formData.value)
          .then((response) => {
            setComponent('2fs');
            setTimeout(() => {
              isLoading.value = false;
            }, 600);
          })
          .catch((errors) => {
            errorMessages.value.push({ type: 'error', message: errors.message });
            setTimeout(() => {
              isLoading.value = false;
            }, 600);
          });
    } break;
  }
}

const parsedMessages = computed(() => {
  if (!errorMessages.value?.length) return [];

  return errorMessages.value.map(i => {
    i.id = useNuxtApp().$_hash(`${i.type}-${i.message || i.text}`);

    return i;
  });
});

const handleRemoveMessage = (msg:AppMessageType) => {
  errorMessages.value = parsedMessages.value.filter(i => i.id !== msg.id);
}

const handleChange = () => {
  isLoading.value = true;
}

onNuxtReady(() => {
  if (clientState().value.client?.session && clientState().value.client?.sessionState) {
    switch (parseInt(clientState().value.client?.sessionState)) {
      case 2: {
        setComponent('2fs');
      } break;
    }
  }

  setTimeout(() => {
    isLoading.value = false;
  }, 600);
});
</script>

<template>
  <div
      class="authorize-page auth-form margin-auto"
  >

    <div class="g-row margin-auto text-align-center">
      <div class="g-col --span-24">
        <component
            :key="visibleComponent"
            :is="pageComponent"
            v-model="formData"
            :error-messages="errorMessages"
            :loading="isLoading"
            @go-back="setComponent('loginForm')"
            @changed="handleChange()"
            @submitted="handleFormSubmit()"
            @clear-message="handleRemoveMessage"
        />
      </div>
    </div>
  </div>
</template>
