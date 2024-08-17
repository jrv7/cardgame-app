import {EntityInterface} from "~/composables/entity/Interface/EntityInterface";

export type oPlayer = {
    id:number|null,
    uid:string|null,
    name:string|null,
    nickname:string|null,
    avatarUrl:string|null,
};

export interface PlayerInterface extends EntityInterface {
    id:number|null;
    uid:string|null;
    name:string|null;
    nickname:string|null;
    avatar:string|null;
}