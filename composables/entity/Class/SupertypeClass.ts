import {EntityClass} from "~/composables/entity/Class/EntityClass";
import {oSupertype} from "~/composables/entity/Interface/SupertypeInterface";
import {oColor} from "~/composables/entity/Interface/ColorInterface";


export class SupertypeClass extends EntityClass {
    private _id:number|null;
    private _name:string|null;
    private _original:SupertypeClass|null;

    constructor(object:oSupertype|null = null, setOriginal:boolean = true) {
        super();
        this._id = this.$deepClone(object?.id ?? null);
        this._name = this.$deepClone(object?.name ?? null);

        if (setOriginal) {
            this._original = new SupertypeClass(object, false);
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

    toObject():oSupertype {
        return {
            id: this._id,
            name: this._name,
        }
    }
}