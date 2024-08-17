import {EntityInterface} from "~/composables/entity/Interface/EntityInterface";
import {PlayerClass} from "~/composables/entity/Class/PlayerClass";
import {oPlayer} from "~/composables/entity/Interface/PlayerInterface";
import {oDeck} from "~/composables/entity/Interface/DeckInterface";
import {DeckClass} from "~/composables/entity/Class/DeckClass";

export type oGamePlayer = {
    id:number|null,
    player:oPlayer|null,
    deck:oDeck|null,
};

export interface GamePlayerInterface extends EntityInterface {
    id:number|null;
    player:PlayerClass|null;
    deck:DeckClass|null;
}