import {EntityClass} from "~/composables/entity/Class/EntityClass";
import {oLibraryCard} from "~/composables/entity/Interface/LibraryCardInterface";
import {oLibrary} from "~/composables/entity/Interface/LibraryInterface";
import {LibraryCardClass} from "~/composables/entity/Class/LibraryCardClass";
import {oHandCard} from "~/composables/entity/Interface/HandCardInterface";
import {oHand} from "~/composables/entity/Interface/HandInterface";

export class LibraryClass extends EntityClass {
    private _empty:boolean = false;
    private _size:number = 0;
    private _cards:LibraryCardClass[] = [];

    constructor(object: oLibraryCard[]|null = null) {
        super();

        if (object) {
            this._cards = object.length ? object.map((c:oLibraryCard) => (new LibraryCardClass(c)) ) : [];
        }

        this._empty = !this._cards?.length;
        this._size = this._cards?.length ?? 0;

        return this;
    }

    get empty(): boolean { return this._empty; }
    set empty(value: boolean) { this._empty = value; }
    get size(): number { return this._size; }
    set size(value: number) { this._size = value; }
    get cards(): LibraryCardClass[] { return this._cards; }
    set cards(value: LibraryCardClass[]) { this._cards = value; }
    get visibleCards():LibraryCardClass[] {
        return this.cards.filter((c:LibraryCardClass) => { return c.visibleToOwner }) ?? []
    }

    async lookAtTop(quantity:number) {
        return new Promise((res) => {
            for(let i = 0; i < quantity; i++) {
                this.cards.find(c => c.position === i)?.showToMe();
            }

            res(true);
        })
    }

    async draw(position:number) {
        return new Promise((res) => {
            const card = this._cards.find(c => c.position === position);

            this._cards = this._cards.filter(c => c !== card).map((c, index) => {
                // if (c.position > position) {
                //     c.position--;
                // }
                c.position = index;
                return c;
            })

            this._size = this._cards.length;
            this._empty = !this._cards.length;

            res(card);
        })
    }

    async pushToBottom(cards:oLibraryCard[]) {
        return new Promise((res) => {
            const currentLength = parseInt(`${this._cards.length}`);
            this._cards = [...this._cards, ...cards.map((c, index) => ( new LibraryCardClass(c, (currentLength + index)) ) )]

            this._size = this._cards.length;
            this._empty = !this._cards.length;

            res(true);
        })
    }

    toObject():oLibrary {
        return {
            empty: this._empty,
            size: this._size,
            cards: this._cards?.map(c => c.toObject()) ?? []
        };
    }
}