import {EntityInterface} from "~/composables/entity/Interface/EntityInterface";
import {CardClass} from "~/composables/entity/Class/CardClass";
import {oCard} from "~/composables/entity/Interface/CardInterface";

export type oHandCard = {
    position:number,
    cardHash:string,
    card:oCard|null
};

export interface HandCardInterface extends EntityInterface {
    position:number;
    cardHash:string;
    card:CardClass|null;
}