import {SimpleButtonSizeType, SimpleButtonTypeType} from "~/composables/customTypes/SimpleButtonTypes";


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