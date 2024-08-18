import {GamePlayerClass} from "~/composables/entity/Class/GamePlayerClass";
import {oGamePlayer} from "~/composables/entity/Interface/GamePlayerInterface";
import {SessionControllerInterface} from "~/composables/entity/Controller/SessionControllInterface";
import {DeckClass} from "~/composables/entity/Class/DeckClass";
import {LibraryClass} from "~/composables/entity/Class/LibraryClass";
import {oLibraryCard} from "~/composables/entity/Interface/LibraryCardInterface";
import {LibraryCardClass} from "~/composables/entity/Class/LibraryCardClass";
import {DeckCardClass} from "~/composables/entity/Class/DeckCardClass";
import {HandClass} from "~/composables/entity/Class/HandClass";
import {HandCardClass} from "~/composables/entity/Class/HandCardClass";
import {HandInterface} from "~/composables/entity/Interface/HandInterface";
import {oHandCard} from "~/composables/entity/Interface/HandCardInterface";


export class GamePlayerControllerClass extends SessionControllerInterface {
    private _GamePlayer:GamePlayerClass|null = null;
    private _Deck:DeckClass|null = null;
    private _Library:LibraryClass|null = null;
    private _Hand:HandClass = new HandClass();
    private _mulligans:Ref<number> = ref(-1) as Ref<number>;
    private _readyToPlay:Ref<boolean> = ref(false) as Ref<boolean>;

    constructor(state:any) {
        super(state);
    }

    get GamePlayer(): GamePlayerClass | null { return this._GamePlayer; }
    set GamePlayer(value: GamePlayerClass | null) { this._GamePlayer = value; }
    get mulligans(): number { return this._mulligans; }
    set mulligans(value: number) { this._mulligans = value; }
    get Deck(): DeckClass | null { return this._Deck; }
    set Deck(value: DeckClass | null) { this._Deck = value; }
    get Library(): LibraryClass | null { return this._Library; }
    set Library(value: LibraryClass | null) { this._Library = value; }
    get Hand(): HandClass {
        return this._Hand;
    }
    get HandCards(): HandInterface {
        return {
            empty: this._Hand.empty,
            size: this._Hand.size,
            maxSize: this._Hand.maxSize,
            cards: this._Hand.cards.map(c => {
                c.card = this.Deck?.cards?.find(dc => dc.card.id === c.secret);
                return c;
            })
        } as HandInterface;
    }
    set Hand(value: HandClass) { this._Hand = value; }
    get Session():any {
        return this._gameState.Session;
    }
    get readyToPlay(): Ref<boolean> { return this._readyToPlay; }
    set readyToPlay(value: Ref<boolean>) { this._readyToPlay = value; }

    increaseMulligan() {
        this._mulligans++;
    }

    get playerId():number {
        return this._GamePlayer?.player?.id ?? 0
    }

    async init() {
        return new Promise((res, rej) => {
            const playerData = this.Session.players.find((p:oGamePlayer) => p.player.uid === this._gameState.PlayerUid);
            this.GamePlayer = new GamePlayerClass(playerData)
            this._mulligans = (![null, undefined].includes(playerData.player.mulligans)) ? playerData.player.mulligans : -1;

            if (playerData.hand?.cards) {
                this._Hand = new HandClass(playerData.hand.cards);
            }
            if (playerData.library?.cards) {
                this._Library = new LibraryClass(playerData.library.cards);
            }

            this._readyToPlay = !!playerData.readyToPlay;

            res(true);
        })
    }

    async shuffle() {
        return new Promise((resolve, reject) => {
            useApiPost(`/session/${this.gameUid}/shuffle/${this.playerId}`, {mulligans: this.mulligans})
                .then(({success, data}:{success:boolean, data:oLibraryCard[]}) => {
                    this.Library = new LibraryClass(data);
                    resolve(data);
                })
        })
    }

    viewCards(ids:number[] = []) {
        return this._Deck?._cards?.filter((c:DeckCardClass) => {
            return ids.includes(c.card.id!)
        }).map((c:DeckCardClass) => c.card)
    }

    async drawTop(quantity:number) {
        return new Promise((res) => {
            for(let i = 0; i < quantity; i++) {
                this.Library.draw(i)
                    .then((card:LibraryCardClass) => {
                        const obj = card.toObject();
                        let newCard = new HandCardClass({
                            position: obj.position,
                            cardHash: obj.card,
                            card: this.Deck?.cards?.find(dc => dc.card.id === card.secret).card?.toObject()
                        } as oHandCard)

                        this._Hand?.addCard(newCard)
                    })
            }

            res(true);
        })
    }

    async putBack(hashes:string[]) {
        const handCards = this._Hand.cards.filter(c => hashes.includes(c.cardHash)).map(c => ( c.toObject(false) ))
        await this._Hand.remove(hashes);
        await this._Library.pushToBottom(handCards.map(c => ( { position: c.position, card: c.cardHash } as oLibraryCard ) ));
    }

    async mulligan() {
        this._Hand.cards = [];
        this._mulligans++;
    }

    async persistHand() {
        return new Promise((res, rej) => {
            useApiPost(`/session/${this.gameUid}/persist-hand/${this.playerId}`, {hand: this._Hand.toObject()})
                .then((response) => {
                    res(true);
                })
                .catch((err) => {
                    console.log('Could not persist hand', err)
                    rej(err)
                })
        })
    }

    async persistLibrary() {
        return new Promise((res, rej) => {
            useApiPost(`/session/${this.gameUid}/persist-library/${this.playerId}`, {library: this._Library?.toObject()})
                .then((response) => {
                    res(true);
                })
                .catch((err) => {
                    console.log('Could not persist library', err)
                    rej(err);
                })
        })
    }
}