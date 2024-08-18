import {EntityInterface} from "~/composables/entity/Interface/EntityInterface";
import {oCard} from "~/composables/entity/Interface/CardInterface";
import {CardClass} from "~/composables/entity/Class/CardClass";

export type oDeckCard = {
    id:number,
    deckId:number,
    card:oCard,
    quantity:number,
    cardVariation:number|null,
};

export interface DeckCardInterface extends EntityInterface {
    id:number;
    deckId:number;
    card:CardClass;
    quantity:number;
    cardVariation:number|null;
}