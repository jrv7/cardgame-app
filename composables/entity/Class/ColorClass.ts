import {EntityClass} from "~/composables/entity/Class/EntityClass";
import {oColor} from "~/composables/entity/Interface/ColorInterface";
import {object} from "zod";


export class ColorClass extends EntityClass {
    private _id:number|null;
    private _code:string|null;
    private _mtgCode:string|null;
    private _name:string|null;
    private _colorOrder:number|null;
    private _original:ColorClass|null;

    constructor(object:oColor|null = null, setOriginal:boolean = true) {
        super();
        this._id = this.$deepClone(object?.id ?? null);
        this._code = this.$deepClone(object?.code ?? null);
        this._mtgCode = this.$deepClone(object?.mtgCode ?? null);
        this._name = this.$deepClone(object?.name ?? null);
        this._colorOrder = this.$deepClone(object?.colorOrder ?? null);

        if (setOriginal) {
            this._original = new ColorClass(object, false);
        }

        return this;
    }

    get id(): number | null {
        return this._id;
    }
    set id(value: number | null) {
        this._id = value;
    }

    get code(): string | null {
        return this._code;
    }
    set code(value: string | null) {
        this._code = value;
    }

    get mtgCode(): string | null {
        return this._mtgCode;
    }
    set mtgCode(value: string | null) {
        this._mtgCode = value;
    }

    get name(): string | null {
        return this._name;
    }
    set name(value: string | null) {
        this._name = value;
    }

    get colorOrder(): number | null {
        return this._colorOrder;
    }
    set colorOrder(value: number | null) {
        this._colorOrder = value;
    }
}