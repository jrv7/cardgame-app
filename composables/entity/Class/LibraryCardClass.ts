import {EntityClass} from "~/composables/entity/Class/EntityClass";
import {oLibraryCard} from "~/composables/entity/Interface/LibraryCardInterface";

export class LibraryCardClass extends EntityClass {
    private _position:number;
    private _card:string;
    private _visibleToOwner:boolean = false;
    private _visibleToAll:boolean = false;
    private _visibleToPlayers:number[] = [];

    constructor(object: oLibraryCard, position:number|null = null) {
        super();
        this._position = (position !== null ? position : this.$deepClone(object.position));
        this._card = this.$deepClone(object.card);

        return this;
    }

    get position(): number { return this._position; }
    set position(value: number) { this._position = value; }
    get card(): string { return this._card; }
    set card(value: string) { this._card = value; }
    get visibleToOwner(): boolean { return this._visibleToOwner; }
    set visibleToOwner(value: boolean) { this._visibleToOwner = value; }
    get visibleToAll(): boolean { return this._visibleToAll; }
    set visibleToAll(value: boolean) { this._visibleToAll = value; }
    get visibleToPlayers(): number[] { return this._visibleToPlayers; }
    set visibleToPlayers(value: number[]) { this._visibleToPlayers = value; }
    get secret():number {
        const idLen = parseInt(this.card.substr(7, 2));
        return parseInt(this.card.substr((this.card.length - (2 * idLen)), idLen));
    }

    showToMe():void { this.visibleToOwner = true; }
    showEverybody():void { this.visibleToAll = true; }
    showToPlayer(value:number):void { this.visibleToPlayers = [...this.visibleToPlayers.filter(i => i !== value), value]; }

    toObject():oLibraryCard {
        return {
            position: this._position,
            card: this._card,
        } as oLibraryCard
    }
}