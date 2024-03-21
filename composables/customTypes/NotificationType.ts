import {SimpleButtonTypeType} from "~/composables/customTypes/SimpleButtonTypes";


export type NotificationType = {
    message: string
    active?: boolean
    id?: string
    type?: SimpleButtonTypeType
    timeout?: number
    alive: boolean
};