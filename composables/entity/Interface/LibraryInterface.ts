import {EntityInterface} from "~/composables/entity/Interface/EntityInterface";
import {oHandCard} from "~/composables/entity/Interface/HandCardInterface";
import {HandCardClass} from "~/composables/entity/Class/HandCardClass";

export type oLibrary = {
    empty:boolean,
    size:number,
    cards:oHandCard[],
};

export interface LibraryInterface extends EntityInterface {
    empty:boolean;
    size:number;
    cards:HandCardClass[];
}