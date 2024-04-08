
import {EntityColumnType, EntityInterface} from "~/composables/entity/EntityInterface";
import {GameFormatInterface} from "~/composables/entity/GameFormatInterface";
import {PlayerInterface} from "~/composables/entity/PlayerInterface";
import {DeckInterface} from "~/composables/entity/DeckInterface";

export type self = GamePlayerInterface;

export type GamePlayerType = {
    id: number,
    player:PlayerInterface,
    deck:DeckInterface|null
};

export interface GamePlayerInterface extends EntityInterface {
    id: number;
    player:PlayerInterface;
    deck:DeckInterface|null;

    // id: number;
    getId(): number;
    setId(value: number): self;
    // player;
    getPlayer():PlayerInterface;
    setPlayer(value:PlayerInterface): self;
    // deck;
    getDeck():DeckInterface|null;
    setDeck(value:DeckInterface|null): self;

    getColumns(): EntityColumnType[];

    transformFromObject(object: {}): self
}