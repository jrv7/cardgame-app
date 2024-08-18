import {EntityInterface} from "~/composables/entity/Interface/EntityInterface";
import {oGameFormat} from "~/composables/entity/Interface/GameFormatInterface";
import {oCard} from "~/composables/entity/Interface/CardInterface";
import {CardClass} from "~/composables/entity/Class/CardClass";
import {oDeckCard} from "~/composables/entity/Interface/DeckCardInterface";
import {DeckCardClass} from "~/composables/entity/Class/DeckCardClass";

export type oDeck = {
    id:number|null,
    gameFormat:oGameFormat|null,
    name:string|null,
    coverCard:any,
    primaryCard:any,
    secondaryCard:any,
    cards:oDeckCard[]|null
};

export interface DeckInterface extends EntityInterface {
    id:number|null;
    gameFormat:oGameFormat|null;
    name:string|null;
    coverCard:any;
    primaryCard:any;
    secondaryCard:any;
    cards:DeckCardClass[]|null;
}