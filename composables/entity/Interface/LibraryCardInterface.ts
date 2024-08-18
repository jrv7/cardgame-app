import {EntityInterface} from "~/composables/entity/Interface/EntityInterface";

export type oLibraryCard = {
    position:number,
    card:string,
};

export interface LibraryCardInterface extends EntityInterface {
    position:number;
    card:string;
}