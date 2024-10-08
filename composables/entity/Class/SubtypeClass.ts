import {EntityClass} from "~/composables/entity/Class/EntityClass";
import {oSubtype} from "~/composables/entity/Interface/SubtypeInterface";
import {oType} from "~/composables/entity/Interface/TypeInterface";


export class SubtypeClass extends EntityClass {
    private _id:number|null;
    private _name:string|null;
    private _original:SubtypeClass|null;

    constructor(object:oSubtype|null = null, setOriginal:boolean = true) {
        super();
        this._id = this.$deepClone(object?.id ?? null);
        this._name = this.$deepClone(object?.name ?? null);

        if (setOriginal) {
            this._original = new SubtypeClass(object, false);
        }

        return this;
    }

    get id(): number | null {
        return this._id;
    }
    set id(value: number | null) {
        this._id = value;
    }
    get name(): string | null {
        return this._name;
    }
    set name(value: string | null) {
        this._name = value;
    }

    toObject():oSubtype {
        return {
            id: this._id,
            name: this._name,
        }
    }
}