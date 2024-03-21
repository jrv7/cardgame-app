<script setup lang="ts">
import {AppMessageType} from "~/composables/customTypes/AppMessageType";
import {UnwrapRef} from "vue";

const refDataForm = ref(null);
const emit = defineEmits(['update:modelValue', 'submitted', 'changed', 'go-forward', 'add-message', 'clear-message']);

const props = withDefaults(
    defineProps<{
      modelValue: object,
      errorMessages?: AppMessageType[] | null,
      loading?:boolean,
    }>(), {
      errorMessages: null,
      loading: false
    }
);

const isTyping = ref(false);

const formData = computed({
  get() { return props.modelValue; },
  set(value:object) {
    emit('update:modelValue', value);
    emit('changed');
  }
});

const handleFormSubmit = () => {
  emit('submitted', true);
  // emit('changed', true);
  //
  // setTimeout(() => {
  //   //refDataForm.value.submit();
  //   emit('go-forward', true);
  // }, 2000);
  return false;
}

const handleRemoveMessage = (msg:AppMessageType) => {
  emit('clear-message', msg);
}

const setIsTyping = (value:boolean = true) => {
  isTyping.value = value;
}

const isValidEmail = computed(() => {
  const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  let isValid: boolean = useNuxtApp().$_regex(emailRegex, formData.value.email);
  const invalidEmailMessage:AppMessageType = { type: 'error', message: 'invalid_email_error_message', id: useNuxtApp().$_hash('error-invalid_email_error_message') };

  if (isTyping.value) {
    handleRemoveMessage(invalidEmailMessage);
    return true;
  }

  if (!isValid && !props.errorMessages?.find(i => (i.type === invalidEmailMessage.type && i.message === invalidEmailMessage.message))) {
    emit('add-message', invalidEmailMessage);
  }

  if (isValid) {
    handleRemoveMessage(invalidEmailMessage);
  }

  return isValid;
});
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
        :loading="loading"
    >
      <div class="g-row margin-auto text-align-center --width-px-390">
        <div class="g-col --span-23">
          <span class="text-px-18 --txt-color-dark-gray" v-html="$_Tt('auth_form_greeting_message')" />
        </div>
      </div>

      <div class="g-row margin-auto text-align-center --width-px-390"><div class="g-col">&nbsp;</div></div>

      <div class="g-row margin-auto text-align-center --width-px-390">
        <div class="g-col --span-8 margin-auto margin-top-24 margin-bottom-24">
          <img class="user-icon" src="~/assets/images/icons/user-icon-001.png">
        </div>
      </div>

      <div class="g-row margin-auto text-align-center --width-px-390">
        <div class="g-col --span-0">
          <app-input
              type="string"
              sub-type="email"
              name="email"
              left-icon="user"
              v-model="formData.email"
              :with-errors="formData.email && !isValidEmail"
              :placeholder="$_Tt('email_address_placeholder')"
              @focused="setIsTyping()"
              @blurred="setIsTyping(false)"
          />
        </div>
      </div>

      <div class="g-row margin-auto text-align-center --width-px-390">
        <div class="g-col --span-0">
          <app-input-password
              name="password"
              v-model="formData.password"
          />
        </div>
      </div>

      <template v-if="errorMessages.length">
        <div class="g-row margin-auto text-align-center --width-px-390"><div class="g-col">&nbsp;</div></div>

        <template
            v-for="msg in errorMessages" :key="msg"
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
            :disabled="!formData.email || !isValidEmail || !formData.password"
            @clicked="handleFormSubmit()"
        >{{ $_TT('next') }}</app-button>
      </div>
    </app-card>
  </form>
</template>