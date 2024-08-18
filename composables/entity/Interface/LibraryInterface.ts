import {EntityInterface} from "~/composables/entity/Interface/EntityInterface";
import {oLibraryCard} from "~/composables/entity/Interface/LibraryCardInterface";
import {LibraryCardClass} from "~/composables/entity/Class/LibraryCardClass";

export type oLibrary = {
    empty:boolean,
    size:number,
    cards:oLibraryCard[],
};

export interface LibraryInterface extends EntityInterface {
    empty:boolean;
    size:number;
    cards:LibraryCardClass[];
}