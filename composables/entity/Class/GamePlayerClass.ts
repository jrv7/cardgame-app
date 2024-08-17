import {EntityClass} from "~/composables/entity/Class/EntityClass";
import {oGamePlayer} from "~/composables/entity/Interface/GamePlayerInterface";
import {PlayerClass} from "~/composables/entity/Class/PlayerClass";
import {DeckClass} from "~/composables/entity/Class/DeckClass";


export class GamePlayerClass extends EntityClass {
    private _id:number|null;
    private _player:PlayerClass|null;
    private _deck:DeckClass|null;
    private _original:GamePlayerClass|null;

    constructor(object:oGamePlayer|null = null, setOriginal:boolean = true) {
        super();
        this._id = this.$deepClone(object?.id ?? null);
        this._player = object?.player ? ( new PlayerClass(object.player) ) : null;
        this._deck = object?.deck ? ( new DeckClass(object.deck) ) : null;

        if (setOriginal) {
            this._original = new GamePlayerClass(object, false);
        }

        return this;
    }

    get id(): number | null {
        return this._id;
    }
    set id(value: number | null) {
        this._id = value;
    }
    get player(): PlayerClass | null {
        return this._player;
    }
    set player(value: PlayerClass | null) {
        this._player = value;
    }
    get deck(): DeckClass | null {
        return this._deck;
    }
    set deck(value: DeckClass | null) {
        this._deck = value;
    }
}