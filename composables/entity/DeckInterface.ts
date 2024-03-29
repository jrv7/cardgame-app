
import {EntityColumnType, EntityInterface} from "~/composables/entity/EntityInterface";
import {GameFormatInterface} from "~/composables/entity/GameFormatInterface";
import {CardInterface} from "~/composables/entity/CardInterface";

export type self = DeckInterface;

export type DeckType = {
    id: number,
    gameFormat: GameFormatInterface|null,
    coverCard: CardInterface|null,
    name:string|null,
    description:string|null,
};

export interface DeckInterface extends EntityInterface {
    id: number;
    gameFormat: GameFormatInterface|null;
    coverCard: CardInterface|null;
    name:string|null;
    description:string|null;

    // id: number;
    getId(): number;
    setId(value: number): self;
    // gameFormat: number;
    getGameFormat(): GameFormatInterface|null;
    setGameFormat(value: GameFormatInterface|null): self;
    // coverCard: string;
    getCoverCard():CardInterface|null;
    setCoverCard(value:CardInterface|null): self;
    // name: string;
    getName():string|null;
    setName(value:string|null): self;
    // name: string;
    getDescription():string|null;
    setDescription(value:string|null): self;

    getColumns(): EntityColumnType[];

    transformFromObject(object: {}): self
}