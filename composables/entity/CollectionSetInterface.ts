
import {EntityColumnType, EntityInterface} from "~/composables/entity/EntityInterface";

export type self = CollectionSetInterface;

export type CollectionSetType = {
    id: number,
    code:string,
    name:string|null,
    releaseDate:string|null
};

export interface CollectionSetInterface extends EntityInterface {
    id: number;
    code:string;
    name:string|null;
    releaseDate:string|null;

    // id: number;
    getId(): number;
    setId(value: number): self;
    // code:string|null;
    getCode():string;
    setCode(value:string): self;
    // name:string|null;
    getName():string|null;
    setName(value:string|null): self;
    // releaseDate:string|null;
    getReleaseDate():string|null;
    setReleaseDate(value:string|null): self;

    getColumns(): EntityColumnType[];

    transformFromObject(object: {}): self
}