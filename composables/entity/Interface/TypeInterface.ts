import {EntityInterface} from "~/composables/entity/Interface/EntityInterface";

export type oType = {
    id:number|null,
    name:string|null,
};

export interface TypeInterface extends EntityInterface {
    id:number|null;
    name:string|null;
}