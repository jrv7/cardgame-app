import {SimpleButtonSizeType, SimpleButtonTypeType} from "~/composables/customTypes/SimpleButtonTypes";
import {SimpleIconType} from "~/composables/customTypes/SimpleIconType";

export type ModalSizeType = 'normal'|'sm'|'xs'|'lg'|'xl'|'full';
export type ModalTypeType = 'full'|'full-left'|'full-right'|'center-top'|'center-bottom'|'middle'|'corner-right-top'|'corner-right-bottom'|'corner-left-top'|'corner-left-bottom';

export type AppModalType = {
  type:ModalTypeType,
  size:ModalSizeType,
  title:string,
  component:any,
  id?:string,
  icon?:string|string[],
  componentData?:any,
  modelValue?:any,
  backdrop?:boolean,
  closeOnBackdropClick?:boolean,
  noPadding?:boolean,
  referential?:any,
  buttons?:{
    close?:boolean,
    confirm?:any,
    cancel?:any
  },
  onClose?:any,
  onFinish?:any,
  onCancel?:any,
  show?:() => {},
  hide?:() => {},
  visible?:boolean
}

export type ModalButtonType =
    string |
    boolean |
    {
        text: string,
        type: SimpleButtonTypeType,
        size: SimpleButtonSizeType,
        icon?: string[]
    };

export type ModalConfirmationType = boolean | ('onRemoving' | 'onDeleting' | 'onChanging')[];