
import {EntityColumnType, EntityInterface} from "~/composables/entity/EntityInterface";

export type self = GameFormatInterface;

export type GameFormatType = {
    id: number,
    name:string
};

export interface GameFormatInterface extends EntityInterface {
    id: number;
    name:string;

    // id: number;
    getId(): number;
    setId(value: number): self;
    // name:string|null;
    getName():string;
    setName(value:string): self;

    getColumns(): EntityColumnType[];

    transformFromObject(object: {}): self
}