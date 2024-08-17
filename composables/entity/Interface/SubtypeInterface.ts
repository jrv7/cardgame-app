import {EntityInterface} from "~/composables/entity/Interface/EntityInterface";

export type oSubtype = {
    id:number|null,
    name:string|null,
};

export interface SubtypeInterface extends EntityInterface {
    id:number|null;
    name:string|null;
}