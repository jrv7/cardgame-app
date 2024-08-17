import {EntityClass} from "~/composables/entity/Class/EntityClass";
import {oPlayer} from "~/composables/entity/Interface/PlayerInterface";
import {object} from "zod";


export class PlayerClass extends EntityClass {
    private _id:number|null;
    private _uid:string|null;
    private _name:string|null;
    private _nickname:string|null;
    private _avatar:string|null;
    private _original:PlayerClass|null;

    constructor(object:oPlayer, setOriginal:boolean = false) {
        super();
        this._id = this.$deepClone(object?.id ?? null);
        this._uid = this.$deepClone(object?.uid ?? null);
        this._name = this.$deepClone(object?.name ?? null);
        this._nickname = this.$deepClone(object?.nickname ?? null);
        this._avatar = this.$deepClone(object?.avatarUrl ?? null);

        if (setOriginal) {
            this._original = new PlayerClass(object, false);
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

    get name(): string | null {
        return this._name;
    }
    set name(value: string | null) {
        this._name = value;
    }

    get nickname(): string | null {
        return this._nickname;
    }
    set nickname(value: string | null) {
        this._nickname = value;
    }

    get avatar(): string | null {
        return this._avatar;
    }
    set avatar(value: string | null) {
        this._avatar = value;
    }
}