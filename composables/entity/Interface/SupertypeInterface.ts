import {EntityInterface} from "~/composables/entity/Interface/EntityInterface";

export type oSupertype = {
    id:number|null,
    name:string|null,
};

export interface SupertypeInterface extends EntityInterface {
    id:number|null;
    name:string|null;
}