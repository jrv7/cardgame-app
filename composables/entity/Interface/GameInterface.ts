import {EntityInterface} from "~/composables/entity/Interface/EntityInterface";
import {oGameFormat} from "~/composables/entity/Interface/GameFormatInterface";
import {GameFormatClass} from "~/composables/entity/Class/GameFormatClass";

export type oGame = {
    id:number|null,
    uid:string|null,
    gameFormat:oGameFormat|null,
    name:string|null,
    status:number,
    startAt:string,
    endedAt:string|null,
};

export interface GameInterface extends EntityInterface {
    id:number|null;
    uid:string|null;
    gameFormat:GameFormatClass|null;
    name:string|null;
    status:number;
    startAt:string;
    endedAt:string|null;
}