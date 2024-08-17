import {SessionClass} from "~/composables/entity/Class/SessionClass";
import {oSession} from "~/composables/entity/Interface/SessionInterface";
import {GamePlayerControllerClass} from "~/composables/entity/Controller/GamePlayerControllerClass";
import {Ref} from "preact/compat";
import {SessionControllerInterface} from "~/composables/entity/Controller/SessionControllInterface";


export class SessionControllerClass extends SessionControllerInterface {
    private _Session:SessionClass|null = null;
    private _Player:GamePlayerControllerClass|null = null;
    private _deckReady:Ref<boolean> = ref(false) as Ref<boolean>;

    constructor(gameState:any) {
        super(gameState);
    }

    get Session(): SessionClass | null {
        return this._Session;
    }

    set Session(value: SessionClass | null) {
        this._Session = value;
    }

    get Player(): GamePlayerControllerClass | null {
        return this._Player;
    }

    set Player(value: GamePlayerControllerClass | null) {
        this._Player = value;
    }

    async init(value:oSession) {
        return new Promise((res, rej) => {
            this._Session = new SessionClass(value);

            if (this._gameState.PlayerUid) {
                this._Player = new GamePlayerControllerClass(this._gameState);
                this._Player.init();
            }

            res(true);
        })
    }

    get isDeckReady():boolean {
        return !!this._deckReady.value;
    }
}