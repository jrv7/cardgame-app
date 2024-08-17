import {EntityInterface} from "~/composables/entity/Interface/EntityInterface";

export type oGameFormat = {
    id:number|null,
    name:string|null,
};

export interface GameFormatInterface extends EntityInterface {
    id:number|null;
    name:string|null;
}