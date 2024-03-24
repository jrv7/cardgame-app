
import {EntityColumnType, EntityInterface} from "~/composables/entity/EntityInterface";
import {CollectionSet} from "~/composables/entity/CollectionSet";

export type self = ImageCollectionInterface;

export type ImageCollectionType = {
    collectionSet:CollectionSet,
    collectionImage:string
};

export interface ImageCollectionInterface extends EntityInterface {
    collectionSet:CollectionSet;
    collectionImage:string;

    // code:string|null;
    getCollectionSet():CollectionSet;
    setCollectionSet(value:CollectionSet): self;
    // name:string|null;
    getCollectionImage():string;
    setCollectionImage(value:string): self;

    getColumns(): EntityColumnType[];

    transformFromObject(object: {}): self
}