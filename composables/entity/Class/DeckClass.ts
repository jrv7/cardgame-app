import {EntityClass} from "~/composables/entity/Class/EntityClass";
import {oGameFormat} from "~/composables/entity/Interface/GameFormatInterface";
import {oDeck} from "~/composables/entity/Interface/DeckInterface";
import {GameFormatClass} from "~/composables/entity/Class/GameFormatClass";
import {CardClass} from "~/composables/entity/Class/CardClass";
import {oCard} from "~/composables/entity/Interface/CardInterface";
import {object} from "zod";
import {DeckCardClass} from "~/composables/entity/Class/DeckCardClass";
import {oDeckCard} from "~/composables/entity/Interface/DeckCardInterface";
import {oHandCard} from "~/composables/entity/Interface/HandCardInterface";


export class DeckClass extends EntityClass {
    private _id:number|null;
    private _gameFormat:oGameFormat|null;
    private _name:string|null;
    private _coverCard:CardClass|null;
    private _primaryCard:CardClass|null;
    private _secondaryCard:CardClass|null;
    private _cards:DeckCardClass[]|null;
    private _original:DeckClass|null;

    constructor(object:oDeck, setOriginal:boolean = false) {
        super();
        this._id = this.$deepClone(object?.id ?? null);
        this._gameFormat = object?.gameFormat ? (new GameFormatClass(object.gameFormat)) : null;
        this._name = this.$deepClone(object?.name ?? null);
        this._coverCard = object?.coverCard ? (new CardClass(object.coverCard)) : null;
        this._primaryCard = object?.primaryCard ? (new CardClass(object.primaryCard)) : null;
        this._secondaryCard = object?.secondaryCard ? (new CardClass(object.secondaryCard)) : null;
        this._cards = object?.cards ? object.cards.map((c:oDeckCard) => (new DeckCardClass(c)) ) : [];

        if (setOriginal) {
            this._original = new DeckClass(object, false);
        }

        return this;
    }

    get id(): number | null {
        return this._id;
    }
    set id(value: number | null) {
        this._id = value;
    }

    get gameFormat(): oGameFormat | null {
        return this._gameFormat;
    }
    set gameFormat(value: oGameFormat | null) {
        this._gameFormat = value;
    }

    get name(): string | null {
        return this._name;
    }
    set name(value: string | null) {
        this._name = value;
    }

    get coverCard(): CardClass | null {
        return this._coverCard;
    }
    set coverCard(value: CardClass | null) {
        this._coverCard = value;
    }

    get primaryCard(): CardClass | null {
        return this._primaryCard;
    }
    set primaryCard(value: CardClass | null) {
        this._primaryCard = value;
    }

    get secondaryCard(): CardClass | null {
        return this._secondaryCard;
    }
    set secondaryCard(value: CardClass | null) {
        this._secondaryCard = value;
    }

    get cards(): CardClass[] | null {
        return this._cards;
    }
    set cards(value: CardClass[] | null) {
        this._cards = value;
    }
}