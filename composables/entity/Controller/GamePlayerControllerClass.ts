import {GamePlayerClass} from "~/composables/entity/Class/GamePlayerClass";
import {oGamePlayer} from "~/composables/entity/Interface/GamePlayerInterface";
import {SessionControllerInterface} from "~/composables/entity/Controller/SessionControllInterface";


export class GamePlayerControllerClass extends SessionControllerInterface {
    private _GamePlayer:GamePlayerClass|null = null;
    private _mulligans:number = 0;

    constructor(state:any) {
        super(state);
    }

    get GamePlayer(): GamePlayerClass | null { return this._GamePlayer; }
    set GamePlayer(value: GamePlayerClass | null) { this._GamePlayer = value; }
    get mulligans(): number { return this._mulligans; }
    set mulligans(value: number) { this._mulligans = value; }

    increaseMulligan() {
        this._mulligans++;
    }

    get playerId():number {
        return this._GamePlayer?.player?.id ?? 0
    }

    async init() {
        return new Promise((res, rej) => {
            this.GamePlayer = new GamePlayerClass(this._gameState.Session.players.find((p:oGamePlayer) => p.player.uid === this._gameState.PlayerUid))

            res(true);
        })
    }

    async shuffle() {
        return new Promise((resolve, reject) => {
            useDynamicPost(`/session/${this.gameUid}/shuffle/${this.playerId}`, {mulligans: this.mulligans})
                .then((firstHand) => {
                    console.log('Hand draw', firstHand, this.GamePlayer?.deck)
                    // const deckCards = firstHand.data.map(i => {
                    //     return {
                    //         position: i.position,
                    //         cardHash: i.card,
                    //         card: unHashCard(i.card)
                    //     }
                    // });
                    // Deck.value = useNuxtApp().$deepClone(deckCards);
                    // OriginalDeck.value = useNuxtApp().$deepClone(deckCards);
                    resolve(firstHand);
                })
        })
    }
}