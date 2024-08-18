import {SessionClass} from "~/composables/entity/Class/SessionClass";
import {oSession} from "~/composables/entity/Interface/SessionInterface";
import {GamePlayerControllerClass} from "~/composables/entity/Controller/GamePlayerControllerClass";
import {SessionControllerInterface} from "~/composables/entity/Controller/SessionControllInterface";
import {DeckClass} from "~/composables/entity/Class/DeckClass";


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

    get self():SessionClass {
        return this._Session!;
    }

    async init(value:oSession) {
        return new Promise((res, rej) => {
            this._Session = new SessionClass(value);

            if (this._gameState.PlayerUid) {
                this.Player = new GamePlayerControllerClass(this._gameState);
                this.Player.init()
                    .then(() => {
                        if (this.Player!.GamePlayer?.deck?.id) {
                            const pDeck = this.self.decks?.find((d:DeckClass) => {
                                return d.id === this.Player!.GamePlayer!.deck?.id;
                            })

                            if (pDeck) {
                                this.Player!.Deck = pDeck;
                            }
                        }
                    })

            }

            res(true);
        })
    }

    get isDeckReady():boolean {
        return !!this._deckReady;
    }
}