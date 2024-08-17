import {EntityClass} from "~/composables/entity/Class/EntityClass";
import {GameClass} from "~/composables/entity/Class/GameClass";
import {GamePlayerClass} from "~/composables/entity/Class/GamePlayerClass";
import {
    oSession
} from "~/composables/entity/Interface/SessionInterface";
import {oGamePlayer} from "~/composables/entity/Interface/GamePlayerInterface";
import {oDeck} from "~/composables/entity/Interface/DeckInterface";
import {DeckClass} from "~/composables/entity/Class/DeckClass";


export class SessionClass extends EntityClass {
    private _uid:string|null;
    private _game:GameClass|null;
    private _playersReady:boolean;
    private _players:GamePlayerClass[]|null;
    private _decks:DeckClass[]|null;
    private _playersOrder:number[];

    constructor(object:oSession) {
        super();
        this._uid = this.$deepClone(object.uid);
        this._game = new GameClass(object.game);
        this._playersReady = object.playersReady;
        this._players = object.players.map((p:oGamePlayer) => (new GamePlayerClass(p)) );
        this._decks = object.decks?.map((d:oDeck) => (new DeckClass(d)) ) ?? [];
        this._playersOrder = this.$deepClone(object.playersOrder ?? []);

        return this;
    }

    get uid(): string | null {
        return this._uid;
    }
    set uid(value: string | null) {
        this._uid = value;
    }

    get game(): GameClass | null {
        return this._game;
    }
    set game(value: GameClass | null) {
        this._game = value;
    }

    get playersReady(): boolean {
        return this._playersReady;
    }
    set playersReady(value: boolean) {
        this._playersReady = value;
    }

    get players(): GamePlayerClass[] | null {
        return this._players;
    }
    set players(value: GamePlayerClass[] | null) {
        this._players = value;
    }

    get decks(): DeckClass[] | null {
        return this._decks;
    }

    set decks(value: DeckClass[] | null) {
        this._decks = value;
    }

    get playersOrder(): number[] {
        return this._playersOrder;
    }
    set playersOrder(value: number[]) {
        this._playersOrder = value;
    }
}