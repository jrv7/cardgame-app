import {AppModalType} from "~/composables/customTypes/ModalTypes";
import LazyPagePromptConfirmMessage from "~/components/System/Prompt/Confirmation";

export const useModal = () => {
  const modalState = useModalState();

  const generateDefaultModal = () => {
    let d = new Date();
    return {
      id: `MODAL_${modalState.value.length}_${d.getTime()}`,
      type: 'full-right',
      size: 'full',
      title: 'Default modal',
      icon: ['fas', 'filter'],
      modelValue: null,
      visible: false,
      onClose: async () => {
        return new Promise((resolve) => {
          resolve(true);
        });
      }
    } as AppModalType;
  }

  const setModal = (modal:AppModalType):AppModalType => {
    if (!modal.id) {
      let d = new Date();
      modal.id = `MODAL_${modalState.value.length}_${d.getTime()}`
    }

    modal.referential = ref(null);

    modalState.value.push(modal);
    return modalState.value.find(i => i.id === modal.id);
  }

  const showModal = (modal:AppModalType) => {
    modal.visible = true;
  }

  const hideModal = async (modal:AppModalType|string) => {
    let currentModal = modal;
    if (typeof modal === 'string') {
      currentModal = modalState.value.find(i => i.id === modal);
    }
    currentModal.visible = false;

    setTimeout(() => {
      modalState.value = modalState.value.filter(i => i.id !== currentModal.id);
    }, 600);
  }

  return {
    set: setModal,
    show: showModal,
    hide: hideModal,
    getDefault: generateDefaultModal,
    getDefaultConfirmation: async (message:string, title:string|null = null, middleMessage:string|null = null) => {
      return new Promise((resolve, reject) => {
        const confirmationModal:AppModalType = generateDefaultModal();
        confirmationModal.title = `${title || useNuxtApp().$_Tt('default_confirm_prompt_message')}`;
        confirmationModal.component = shallowRef(LazyPagePromptConfirmMessage);
        confirmationModal.componentData = {
          message: message,
          middleMessage: middleMessage
        };
        confirmationModal.closeOnBackdropClick = false;
        confirmationModal.type = 'center-top';
        confirmationModal.size = 'sm';
        confirmationModal.icon = ['fas', 'warning'];
        confirmationModal.buttons = {
          confirm: {
            type: 'danger',
            size: 'sm-squared',
            text: useNuxtApp().$_TT('proceed')
          },
          cancel: {
            type: 'secondary',
            size: 'sm-squared',
            iconLeft: 'arrow-left',
            text: useNuxtApp().$_Tt('cancel')
          },
          close: false
        }
        confirmationModal.onFinish = async (modalData) => {
          return new Promise((confirm) => {
            confirm(true);
            resolve(true);
          })
        }
        confirmationModal.onCancel = async () => {
          return new Promise((confirm, refuse) => {
            setTimeout(() => {
              hideModal(confirmationModal);
            }, 100);
          });
        }
        setModal(confirmationModal);
        showModal(confirmationModal);
      })
    }
  }
};