import {EntityInterface} from "~/composables/entity/Interface/EntityInterface";
import {oHandCard} from "~/composables/entity/Interface/HandCardInterface";
import {HandCardClass} from "~/composables/entity/Class/HandCardClass";

export type oHand = {
    empty:boolean,
    size:number,
    maxSize:number,
    cards:oHandCard[],
};

export interface HandInterface extends EntityInterface {
    empty:boolean;
    size:number;
    maxSize:number;
    cards:HandCardClass[];
}