import {EntityClass} from "~/composables/entity/Class/EntityClass";
import {oCollectionSet} from "~/composables/entity/Interface/CollectionSetInterface";

export class CollectionSetClass extends EntityClass {
    private _id:number|null;
    private _code:string|null;
    private _name:string|null;
    private _releaseDate:string|null;
    private _original:CollectionSetClass|null;

    constructor(object:oCollectionSet|null = null, setOriginal:boolean = true) {
        super();
        this._id = this.$deepClone(object?.id ?? null);
        this._code = this.$deepClone(object?.code ?? null);
        this._name = this.$deepClone(object?.name ?? null);
        this._releaseDate = this.$deepClone(object?.releaseDate ?? null);

        if (setOriginal) {
            this._original = new CollectionSetClass(object, false);
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

    get name(): string | null {
        return this._name;
    }
    set name(value: string | null) {
        this._name = value;
    }

    get releaseDate(): string | null {
        return this._releaseDate;
    }
    set releaseDate(value: string | null) {
        this._releaseDate = value;
    }

    toObject():oCollectionSet {
        return {
            id: this._id,
            code: this._code,
            name: this._name,
            releaseDate: this._releaseDate,
        }
    }
}