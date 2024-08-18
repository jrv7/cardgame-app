import {EntityClass} from "~/composables/entity/Class/EntityClass";
import {oHandCard} from "~/composables/entity/Interface/HandCardInterface";
import {object} from "zod";
import {CardClass} from "~/composables/entity/Class/CardClass";
import {Card} from "~/composables/entity/Card";
import {oCard} from "~/composables/entity/Interface/CardInterface";


export class HandCardClass extends EntityClass {
    private _position:number;
    private _cardHash:string;
    private _card:CardClass|null = null;
    private _visibleToOwner:boolean = true;
    private _visibleToAll:boolean = false;
    private _visibleToPlayers:number[] = [];

    constructor(object: oHandCard) {
        super();
        this._position = this.$deepClone(object.position);
        this._cardHash = this.$deepClone(object.cardHash);
        this._card = object.card ? (new CardClass(object.card)) : null;
        this._visibleToOwner = true;

        return this;
    }

    get position(): number { return this._position; }
    set position(value: number) { this._position = value; }
    get cardHash(): string { return this._cardHash; }
    set cardHash(value: string) { this._cardHash = value; }
    get card(): CardClass | null { return this._card; }
    set card(value: CardClass | null) { this._card = value; }
    get visibleToOwner(): boolean { return this._visibleToOwner; }
    set visibleToOwner(value: boolean) { this._visibleToOwner = value; }
    get visibleToAll(): boolean { return this._visibleToAll; }
    set visibleToAll(value: boolean) { this._visibleToAll = value; }
    get visibleToPlayers(): number[] { return this._visibleToPlayers; }
    set visibleToPlayers(value: number[]) { this._visibleToPlayers = value; }
    get secret():number {
        const idLen = parseInt(this.cardHash.substr(7, 2));
        return parseInt(this.cardHash.substr((this.cardHash.length - (2 * idLen)), idLen));
    }

    toggleVisibilityToOwner() {
        this.visibleToOwner = JSON.parse(JSON.stringify(!this.visibleToOwner));
    }

    toObject(full:boolean = true):oHandCard {
        let obj = {
            position: this._position,
            cardHash: this._cardHash,
            card: null
        };

        if (full) {
            obj.card = this._card?.toObject() ?? null
        }

        return obj;
    }

}