import {EntityClass} from "~/composables/entity/Class/EntityClass";
import {oGame} from "~/composables/entity/Interface/GameInterface";
import {GameFormatClass} from "~/composables/entity/Class/GameFormatClass";


export class GameClass extends EntityClass {
    private _id:number|null;
    private _uid:string|null;
    private _gameFormat:GameFormatClass|null;
    private _name:string|null;
    private _status:number;
    private _startAt:string;
    private _endedAt:string|null;
    private _original:GameClass|null;

    constructor(object:oGame|null = null, setOriginal:boolean = true) {
        super();
        this._id = this.$deepClone(object?.id ?? null);
        this._uid = this.$deepClone(object?.uid ?? null);
        this._gameFormat = object?.gameFormat ? (new GameFormatClass(object?.gameFormat)) : null;
        this._name = this.$deepClone(object?.name ?? null);
        this._status = this.$deepClone(object?.status ?? null);
        this._startAt = this.$deepClone(object?.startAt ?? Date.now().toString());
        this._endedAt = this.$deepClone(object?.endedAt ?? null);

        if (setOriginal) {
            this._original = new GameClass(object, false);
        }

        return this;
    }

    get id(): number | null {
        return this._id;
    }
    set id(value: number | null) {
        this._id = value;
    }

    get uid(): string | null {
        return this._uid;
    }
    set uid(value: string | null) {
        this._uid = value;
    }

    get gameFormat(): GameFormatClass|null {
        return this._gameFormat;
    }
    set gameFormat(value: GameFormatClass|null) {
        this._gameFormat = value;
    }

    get name(): string | null {
        return this._name;
    }
    set name(value: string | null) {
        this._name = value;
    }

    get status(): number {
        return this._status;
    }
    set status(value: number) {
        this._status = value;
    }

    get startAt(): string {
        return this._startAt;
    }
    set startAt(value: string) {
        this._startAt = value;
    }

    get endedAt(): string | null {
        return this._endedAt;
    }
    set endedAt(value: string | null) {
        this._endedAt = value;
    }
}