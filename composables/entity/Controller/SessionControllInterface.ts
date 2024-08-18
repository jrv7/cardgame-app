


export class SessionControllerInterface {
    private _gameState:any = null;
    private __gameStore:any = null;

    constructor() {
        this.__gameStore = useGame();
        if (this._gameState === null) {
            this._gameState = useGameState().value;
        }
    }
    get state() {
        return this._gameState;
    }

    setGameState(value: any) {
        const PlayerUid = this._gameState.PlayerUid;
        this._gameState = value;
        this._gameState.PlayerUid = PlayerUid;
        this.__gameStore.setSession(this._gameState);
    }

    get gameUid():string {
        return this._gameState.Session.game.uid;
    }
    get playerUid():string {
        return this._gameState.Session.PlayerUid;
    }
}