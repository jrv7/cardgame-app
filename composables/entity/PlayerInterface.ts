
import {EntityColumnType, EntityInterface} from "~/composables/entity/EntityInterface";
import {CollectionSet} from "~/composables/entity/CollectionSet";
import {ImageCollection} from "~/composables/entity/ImageCollection";

export type self = PlayerInterface;

export type PlayerType = {
    id: number,
    uid: string,
    name: string,
    nickname:string|null,
    avatarUrl:string|null
};

export interface PlayerInterface extends EntityInterface {
    id: number;
    uid: string;
    name: string;
    nickname:string|null;
    avatarUrl:string|null;

    // id: number;
    getId(): number;
    setId(value: number): self;
    // uid:string|null;
    getUid():string;
    setUid(value:string): self;
    // name:string|null;
    getName():string;
    setName(value:string): self;
    // nickname:string|null;
    getNickname():string|null;
    setNickname(value:string|null): self;
    // avatarUrl:string|null;
    getAvatarUrl():string|null;
    setAvatarUrl(value:string|null): self;

    getColumns(): EntityColumnType[];

    transformFromObject(object: {}): self
}