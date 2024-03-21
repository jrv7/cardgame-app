<script setup lang="ts">

import {UnwrapRef} from "vue";
import {AppMessageType} from "~/composables/customTypes/AppMessageType";
import {compose} from "unenv/runtime/node/stream";

const refDataForm = ref(null);
const clientState = useOauthState;
const oauthHandler = useOauthServerHandler();
const emit = defineEmits(['update:modelValue', 'changed', 'go-back', 'submitted']);

const props = withDefaults(
    defineProps<{
      modelValue: object,
      loading?:boolean,
    }>(), {
      loading: false
    }
);

const errorMessages:Ref<UnwrapRef<AppMessageType[]>> = ref([
  {
    type: 'alert',
    message: 'code_regen_explain_message',
    id: useNuxtApp().$_hash('alert-code_regen_explain_message')
  }
]);

const isTyping = ref(false);

const parseClientPortalConfigs = computed(() => {
  return clientState().value.client?.portalConfigs?.mobileMasking ?? null;
})

const formData = computed({
  get() { return props.modelValue; },
  set(value:object) {
    emit('update:modelValue', value);
    emit('changed');
  }
});

const maskedMobileNumber = computed(() => {
  if (!clientState().value.client?.userData?.mobile) return '-';
  const phoneCountry = useNuxtApp().$getPhoneCountry(clientState().value.client?.userData?.mobile, true);

  if (clientState().value.client?.portalConfigs && clientState().value.client?.portalConfigs?.mobileMasking) {
    const maskConfig = clientState().value.client?.portalConfigs?.mobileMasking.find(i => i.country === phoneCountry.country.fifa);
    let maskedPhone = phoneCountry.phone;

    if (maskConfig.hideIdd) {
      const iids = phoneCountry.country.idd.suffixes.map(i => `${parseInt(phoneCountry.country.idd.root)}${i}`);
      let hasRemoved = false;
      iids.forEach(i => {
        if (maskedPhone.substring(0, i.length) === i && !hasRemoved) {
          maskedPhone = maskedPhone.replace(i, '');
          hasRemoved = true;
        }
      })
    }

    if (maskConfig.length && maskConfig.length !== maskedPhone.length) {
      for(let i = 0; i < maskConfig.length; i++) {
        maskedPhone = `${maskConfig.leftChar}${maskedPhone}`;
      }

      maskedPhone = maskedPhone.substr(-1 * maskConfig.length);
    }

    let reFind = null;
    let reReplace = null;
    maskConfig.masks.forEach(i => {
      reFind = new RegExp(i.find);
      reReplace = new RegExp(i.replace);
      maskedPhone = maskedPhone.replace(reFind, i.replace);
    });

    return maskedPhone;
  }

  return phoneCountry.phone;
})

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

const isValidCode = computed(() => {
  const codeRegex = /^\d{4}$/;
  let isValid: boolean = useNuxtApp().$_regex(codeRegex, formData.value.validationCode);
  const invalidCodeMessage:AppMessageType = { type: 'error', message: 'invalid_code_error_message', id: useNuxtApp().$_hash('error-invalid_code_error_message') };

  if (isTyping.value) {
    handleRemoveMessage(invalidCodeMessage);
    return true;
  }

  if (!isValid && !errorMessages.value.find(i => (i.type === invalidCodeMessage.type && i.message === invalidCodeMessage.message))) {
    errorMessages.value.push(invalidCodeMessage);
  }

  if (isValid) {
    handleRemoveMessage(invalidCodeMessage);
  }

  return isValid;
});

const setIsTyping = (value:boolean = true) => {
  isTyping.value = value;
}

const handleFormSubmit = () => {
  if (!formData.value.validationCode || !isValidCode) return false
  emit('submitted', true);
}

const handleGoBack = async () => {
  await oauthHandler.destroySession()
    .then((response) => {
      emit('go-back', true);
    });
}
</script>

<template>
  <form
      ref="refDataForm"
      id="frm2fsConfirm"
      name="frm2fsConfirm"
      action=""
      method="post"
      @submit.prevent="handleFormSubmit"
  >
    <app-card
        class="grid --width-px-390"
        visible
        :loading="loading"
    >
      <div class="g-row margin-auto text-align-center --width-px-390">
        <div class="g-col --span-23">
          <app-button
              class="text-align-left"
              type="link"
              icon-left="arrow-left-long"
              align-text="left"
              @clicked="handleGoBack()"
          >{{ $_TT('go_back') }}</app-button>
        </div>
      </div>

      <div class="g-row margin-auto text-align-center --width-px-390"><div class="g-col">&nbsp;</div></div>

      <div class="g-row margin-auto text-align-center --width-px-390">
        <div class="g-col --span-23">
          <span class="text-px-18 --txt-color-dark-gray" v-html="$_Tt('sms2fs_form_greeting_message')" />
        </div>
      </div>
      <div class="g-row text-align-center --width-px-390 margin-top-4">
        <div class="g-col --span-23">
          <span class="text-px-24 --txt-color-dark-gray">{{ maskedMobileNumber }}</span>
        </div>
      </div>
      <div class="g-row text-align-center --width-px-390 margin-top-4">
        <div class="g-col --span-23">
          <span class="text-px-14 --txt-color-dark-gray" v-html="$_Tt('sms2fs_form_explanation_message')" />
        </div>
      </div>

      <div class="g-row margin-auto text-align-center --width-px-390"><div class="g-col">&nbsp;</div></div>

      <div class="g-row margin-auto text-align-center --width-px-390">
        <div class="g-col --span-8 margin-auto margin-top-24 margin-bottom-24">
          <img class="user-icon" src="~/assets/images/icons/safe_phone-icon-001.png">
        </div>
      </div>

      <div class="g-row margin-auto text-align-center --width-px-390">
        <div class="g-col --span-0">
          <app-input
              type="string"
              sub-type="number"
              name="2fscode"
              left-icon="comment-sms"
              v-model="formData.validationCode"
              :with-errors="formData.validationCode && !isValidCode"
              :placeholder="$_Tt('sms_code_placeholder')"
              focused
              @focused="setIsTyping()"
              @blurred="setIsTyping(false)"
          />
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
            :disabled="!formData.validationCode || !isValidCode"
            @clicked="handleFormSubmit()"
        >{{ $_TT('connect') }}</app-button>
      </div>
    </app-card>
  </form>
</template>