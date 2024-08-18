import {EntityClass} from "~/composables/entity/Class/EntityClass";
import {CardClass} from "~/composables/entity/Class/CardClass";
import {oDeckCard} from "~/composables/entity/Interface/DeckCardInterface";
import {oLibraryCard} from "~/composables/entity/Interface/LibraryCardInterface";
import {oCard} from "~/composables/entity/Interface/CardInterface";

export class DeckCardClass extends EntityClass {
    private _id:number;
    private _deckId:number;
    private _card:CardClass;
    private _quantity:number;
    private _cardVariation:number|null;

    constructor(object:oDeckCard) {
        super();

        this._id = object.id;
        this._deckId = object.deckId;
        this._card = new CardClass(object.card);
        this._quantity = object.quantity;
        this._cardVariation = object.cardVariation;
    }


    get id(): number { return this._id; }
    set id(value: number) { this._id = value; }
    get deckId(): number { return this._deckId; }
    set deckId(value: number) { this._deckId = value; }
    get card(): CardClass { return this._card; }
    set card(value: CardClass) { this._card = value; }
    get quantity(): number { return this._quantity; }
    set quantity(value: number) { this._quantity = value; }
    get cardVariation(): number | null { return this._cardVariation; }
    set cardVariation(value: number | null) { this._cardVariation = value; }

    toObject():oDeckCard {
        return {
            id: this._id,
            deckId: this._deckId,
            quantity: this._quantity,
            card: this._card?.toObject(),
            cardVariation: this._cardVariation
        } as oDeckCard
    }
}