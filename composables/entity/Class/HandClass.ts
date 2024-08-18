import {EntityClass} from "~/composables/entity/Class/EntityClass";
import {HandCardClass} from "~/composables/entity/Class/HandCardClass";
import {oHandCard} from "~/composables/entity/Interface/HandCardInterface";
import {oHand} from "~/composables/entity/Interface/HandInterface";


export class HandClass extends EntityClass {
    private _empty:boolean = true;
    private _size:number = 0;
    private _maxSize:number = 7;
    private _cards:HandCardClass[] = [];

    constructor(object: oHandCard[]|null = null) {
        super();

        if (object) {
            this._cards = object.length ? object.map((c:oHandCard) => (new HandCardClass(c)) ) : [];
        }

        this._empty = !this._cards?.length;
        this._size = this._cards?.length ?? 0;

        return this;
    }

    get empty(): boolean { return this._empty; }
    set empty(value: boolean) { this._empty = value; }
    get size(): number { return this._size; }
    set size(value: number) { this._size = value; }
    get maxSize(): number { return this._maxSize; }
    set maxSize(value: number) { this._maxSize = value; }
    get cards(): HandCardClass[] { return this._cards; }
    set cards(value: HandCardClass[]) { this._cards = value; }

    addCard(card:HandCardClass) {
        card.position = parseInt(`${this._cards.length}`);
        this._cards.push(card);

        this._size = parseInt(`${this._cards.length}`);
        this._empty = !this._cards.length;
    }

    async remove(hashes:string[]) {
        return new Promise((res) => {
            this._cards = this._cards.filter(c => !hashes.includes(c.cardHash)).map((c, index) => {
                c.position = index
                return c;
            })

            this._size = parseInt(`${this._cards.length}`);
            this._empty = !this._cards.length;

            res(true);
        })
    }

    get visibleCards() {
        return this._cards.filter((c) => c.visibleToOwner)
    }
    get invisibleCards() {
        return this._cards.filter((c) => !c.visibleToOwner)
    }

    toObject(full:boolean = true):oHand {
        return {
            empty: this._empty,
            size: this._size,
            maxSize: this._maxSize,
            cards: this._cards?.map(c => c.toObject(full)) ?? []
        };
    }
}