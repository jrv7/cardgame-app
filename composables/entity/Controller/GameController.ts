import {GameClass} from "~/composables/entity/Class/GameClass";
import {oGame} from "~/composables/entity/Interface/GameInterface";
import {GamePlayerClass} from "~/composables/entity/Class/GamePlayerClass";
import {PlayerClass} from "~/composables/entity/Class/PlayerClass";


export class GameController {
    private _Game:GameClass|null = null;
    private _Player:GamePlayerClass|null;
    private _Players:GamePlayerClass[]|null;

    constructor() {
    }

    get Game(): GameClass | null {
        return this._Game;
    }
    set Game(value: GameClass | null) {
        this._Game = value;
    }

    get Players(): GamePlayerClass[] | null {
        return this._Players;
    }
    set Players(value: GamePlayerClass[] | null) {
        this._Players = value;
    }

    get Player(): GamePlayerClass | null {
        return this._Player;
    }
    set Player(value: GamePlayerClass | null) {
        this._Player = value;
    }

    setGame(game:oGame) {
        this._Game = new GameClass(game);
    }
    async setPlayers(value:GamePlayerClass[]) {
        return new Promise((res, rej) => {
            if (!!value?.length) {
                this._Players = value;
                res(true);
            } else {
                console.log('Cannot set an empty list of players');
                rej(false);
            }
        })
    }
    setPlayer(value:string) {
        if (!this._Players?.length) return;
        const cpIndex:number = this._Players.findIndex((p:GamePlayerClass) => p.player?.uid === value);

        if (cpIndex >= 0) {
            this._Player = this._Players[cpIndex];
        } else {
            console.log(`Cannot find player ${value}`, this._Players);
        }
    }
}