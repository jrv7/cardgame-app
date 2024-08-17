import {EntityInterface} from "~/composables/entity/Interface/EntityInterface";

export type oCollectionSet = {
    id:number|null,
    code:string|null,
    name:string|null,
    releaseDate:string|null,
};

export interface CollectionSetInterface extends EntityInterface {
    id:number|null;
    code:string|null;
    name:string|null;
    releaseDate:string|null;
}