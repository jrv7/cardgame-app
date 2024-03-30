<script setup lang="ts">

import {SimpleIconType} from "~/composables/customTypes/SimpleIconType";
import {ModalSizeType, ModalTypeType} from "~/composables/customTypes/ModalTypes";
import {useModal} from "~/composables/useModal";
const modalHandler = useModal();

const refModalComponent = ref(null);

const props = withDefaults(
    defineProps<{
      type:ModalTypeType,
      size:ModalSizeType,
      title:string,
      component:object,
      componentData?:any,
      id?:string,
      icon?:SimpleIconType,
      modelValue?:boolean,
      backdrop?:boolean,
      closeOnBackdropClick?:boolean,
      noPadding?:boolean,
      invisible?:boolean,
      buttons?:{
        close?:boolean,
        confirm?:boolean,
        cancel?:boolean
      },
      visible?:boolean,
      onClose?:() => {},
      onFinish?:() => {},
      onCancel?:() => {},
    }>(),
    {
      backdrop: true,
      closeOnBackdropClick: true,
      noPadding: false,
      invisible: false,
      buttons: {
        close: true,
        confirm: true,
        cancel:true
      },
      visible: false,
      onClose: null,
      onFinish: null,
      onCancel: null,
    }
);

const open = ref(false);

const parseComponent = computed(() => {
  return props.component;
});

const parsedVisible = computed({
  get: () => {
    return props.visible;
  },
  set: (value:boolean) => {
    console.log('Setting modal visibility as', value);
  }
});

const backgroundImageUrl:string|null = ref(null) as string|null;
const setModalBackgroundImage = (value:string|null) => {
  console.log('Changing modal background image', value);
  backgroundImageUrl.value = value;
}

const backdropClickTrigger:any = ref(null);
const handleBackdropClick = async () => {
  if (null !== backdropClickTrigger.value) return;
  if (!props.closeOnBackdropClick) return;

  backdropClickTrigger.value = true;
  if (null !== props.onClose) {
    await props.onClose()
        .then(() => {
          setTimeout(() => {
            backdropClickTrigger.value = null;
            modalHandler.hide(props.id!);
          }, 100);
        })
  }
}

const handleCancel = async (data:any = null) => {
  if (null !== props.onCancel) {
    await props.onCancel()
        .then(() => {
          modalHandler.hide(props.id!);
        })
        .catch(() => {

        })
  } else {
    await modalHandler.hide(props.id!);
  }
}

const handleConfirm = async () => {
  await new Promise((resolve, reject) => {
    if (!refModalComponent.value.parseModalValue) {
      reject('Could not parse modal values');
    } else {
      refModalComponent.value.parseModalValue()
        .then((modalValue) => {
          resolve(modalValue);
        })
    }
  })
    .then((response) => {
      let callbackFunction = handleCancel;
      let customCallback = false;
      if (!!props.onFinish) {
        callbackFunction = props.onFinish;
        customCallback = true;
      }

      callbackFunction(response)
          .then((resolution) => {
            // Nothing to do
          })
          .finally(() => {
            if (customCallback) {
              modalHandler.hide(props.id!);
            }
          })
    });
}
</script>

<template>
  <div
      class="app-modal"
      :class="[`type-${type}`, `size-${size}`, {'visible': parsedVisible, 'invisible': invisible, 'no-padding': noPadding}]"
  >
    <div
        class="backdrop"
        :class="{'visible': backdrop}"
        @click.self="handleBackdropClick()"
    >
      <div
          v-if="backgroundImageUrl"
          class="background-image"
          :style="[backgroundImageUrl ? {'background-image': `url(${backgroundImageUrl})`} : {}]"
          @click.self="handleBackdropClick()"
      />
    </div>

    <div class="scroller">
      <div class="modal-container">
        <div class="header">
          <div class="icon">
            <fa-icon :icon="(['array', 'object'].includes(typeof icon) ? icon : ['fas', icon])" />
          </div>
          <div class="title">
            <span class="title-text">{{ title }}</span>
          </div>

          <div class="close-button-container" v-if="buttons?.close">
            <slot name="head-close-button">
              <app-button-icon
                  type="link"
                  size="xs"
                  @click="handleBackdropClick()"
              >
                <span class="icon"><fa-icon :icon="['fas', 'xmark']" /></span>
              </app-button-icon>
            </slot>
          </div>
        </div>
        <div class="body">
          <component
              ref="refModalComponent"
              :is="parseComponent"
              v-bind="componentData"
              @set-modal-background="setModalBackgroundImage"
          />
        </div>
        <div class="footer">
          <div class="g-row max-width">
            <div class="g-col --span-12">
              <template
                  v-if="buttons.cancel"
              >
                <template v-if="buttons?.cancel === true">
                  <app-button
                      v-if="buttons.cancel"
                      size="sm"
                      type="secondary"
                      class="padding-h-12"
                      @click="handleCancel()"
                  >
                    {{ $_Tt('cancel') }}
                  </app-button>
                </template>
                <template v-else>
                  <app-button
                      :size="buttons?.cancel?.size || 'sm'"
                      :type="buttons?.cancel?.type || 'secondary'"
                      :icon-left="buttons?.cancel?.iconLeft || 'arrow-up'"
                      class="padding-h-12"
                      @click="handleCancel()"
                  >
                    {{ buttons?.cancel?.text }}
                  </app-button>
                </template>
              </template>
            </div>
            <div class="g-col --span-12">
              <template
                  v-if="buttons.confirm"
              >
                <template v-if="buttons?.confirm === true">
                  <app-button
                      size="sm"
                      type="primary"
                      class="margin-left-auto"
                      :class="buttons?.confirm?.class ?? null"
                      @click="handleConfirm()"
                  >
                    {{ $_Tt('confirm') }}
                  </app-button>
                </template>
                <template v-else>
                  <app-button
                      :size="buttons?.confirm?.size || 'sm'"
                      :type="buttons?.confirm?.type || 'primary'"
                      class="margin-left-auto padding-h-12"
                      :class="buttons?.confirm?.class ?? null"
                      @click="handleConfirm()"
                  >
                    {{ buttons?.confirm?.text }}
                  </app-button>
                </template>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>