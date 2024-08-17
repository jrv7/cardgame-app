


export class SessionControllerInterface {
    protected _gameState:any;

    constructor(state:any) {
        this._gameState = state;
    }

    get state() {
        return this._gameState;
    }

    get gameUid():string {
        return this._gameState.Session.game.uid;
    }
    get playerUid():string {
        return this._gameState.Session.PlayerUid;
    }
}