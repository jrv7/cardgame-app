
import {EntityColumnType, EntityInterface} from "~/composables/entity/EntityInterface";
import {GameFormatInterface} from "~/composables/entity/GameFormatInterface";

export type self = GameInterface;

export type GameType = {
    id: number,
    uid: string,
    gameFormat: GameFormatInterface,
    status:number,
    name:string|null,
    startAt:string,
    endedAt:string|null,
};

export interface GameInterface extends EntityInterface {
    id: number;
    uid: string;
    gameFormat: GameFormatInterface;
    status:number;
    name:string|null;
    startAt:string;
    endedAt:string|null;

    // id: number;
    getId(): number;
    setId(value: number): self;
    // id: number;
    getUid(): string;
    setUid(value: string): self;
    // gameFormat: number;
    getGameFormat(): GameFormatInterface;
    setGameFormat(value: GameFormatInterface): self;
    // status: number;
    getStatus(): number;
    setStatus(value: number): self;
    // name: string;
    getName():string|null;
    setName(value:string|null): self;
    // startAt: string;
    getStartAt():string;
    setStartAt(value:string): self;
    // endedAt: string;
    getEndedAt():string|null;
    setEndedAt(value:string|null): self;

    getColumns(): EntityColumnType[];

    transformFromObject(object: {}): self
}