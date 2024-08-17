import {EntityClass} from "~/composables/entity/Class/EntityClass";
import {oCard} from "~/composables/entity/Interface/CardInterface";
import {ColorClass} from "~/composables/entity/Class/ColorClass";
import {oColor} from "~/composables/entity/Interface/ColorInterface";
import {CollectionSetClass} from "~/composables/entity/Class/CollectionSetClass";
import {oCollectionSet} from "~/composables/entity/Interface/CollectionSetInterface";
import {SupertypeClass} from "~/composables/entity/Class/SupertypeClass";
import {TypeClass} from "~/composables/entity/Class/TypeClass";
import {SubtypeClass} from "~/composables/entity/Class/SubtypeClass";
import {oSupertype} from "~/composables/entity/Interface/SupertypeInterface";
import {oType} from "~/composables/entity/Interface/TypeInterface";
import {oSubtype} from "~/composables/entity/Interface/SubtypeInterface";
import {object} from "zod";

export class CardClass extends EntityClass {
    private _id:number|null;
    private _cardHash:string|null;
    private _cardId:string|null;
    private _cardNumber:number|null;
    private _multiverseId:number|null;
    private _collectionSet:CollectionSetClass|null;
    private _collectionSets:CollectionSetClass[]|null;
    private _colors:ColorClass[]|null;
    private _identityColors:ColorClass[]|null;
    private _supertypes:SupertypeClass[]|null;
    private _types:TypeClass[]|null;
    private _subtypes:SubtypeClass[]|null;
    private _name:string|null;
    private _cmc:number|null;
    private _manaCost:string|null;
    private _power:string|null;
    private _toughness:string|null;
    private _loyalty:string|null;
    private _rarity:string|null;
    private _layout:string|null;
    private _imageUrl:string|null;
    private _artImageUrl:string|null;
    private _backsideImageUrl:string|null;
    private _latestImageUrl:string|null;
    private _oracleText:string|null;
    private _originalText:string|null;
    private _type:string|null;
    private _originalType:string|null;
    private _original:CardClass|null;

    constructor(object:oCard|null = null, setOriginal:boolean = true) {
        super();
        this._id = this.$deepClone(object?.id ?? null);
        this._cardHash = this.$deepClone(object?.cardHash ?? null);
        this._cardId = this.$deepClone(object?.cardId ?? null);
        this._cardNumber = this.$deepClone(object?.cardNumber ?? null);
        this._multiverseId = this.$deepClone(object?.multiverseId ?? null);
        this._collectionSet = object?.collectionSet ? (new CollectionSetClass(object.collectionSet)) : null;
        this._collectionSets = object?.collectionSets ? object.collectionSets.map((cs:oCollectionSet) => (new CollectionSetClass(cs)) ) : [];
        this._colors = object?.colors ? object.colors.map((c:oColor) => new ColorClass(c)) : [];
        this._identityColors = object?.colors ? object.identityColors.map((c:oColor) => (new ColorClass(c)) ) : [];
        this._supertypes = object?.supertypes ? object.supertypes.map((spt:oSupertype) => (new SupertypeClass(spt)) ) : [];
        this._types = object?.types ? object.types.map((t:oType) => (new TypeClass(t)) ) : [];
        this._subtypes = object?.subtypes ? object.subtypes.map((sbt:oSubtype) => (new SubtypeClass(sbt)) ) : [];
        this._name = this.$deepClone(object?.name ?? null);
        this._cmc = this.$deepClone(object?.cmc ?? null);
        this._manaCost = this.$deepClone(object?.manaCost ?? null);
        this._power = this.$deepClone(object?.power ?? null);
        this._toughness = this.$deepClone(object?.toughness ?? null);
        this._loyalty = this.$deepClone(object?.loyalty ?? null);
        this._rarity = this.$deepClone(object?.rarity ?? null);
        this._layout = this.$deepClone(object?.layout ?? null);
        this._imageUrl = this.$deepClone(object?.imageUrl ?? null);
        this._artImageUrl = this.$deepClone(object?.artImageUrl ?? null);
        this._backsideImageUrl = this.$deepClone(object?.backsideImageUrl ?? null);
        this._latestImageUrl = this.$deepClone(object?.latestImageUrl ?? null);
        this._oracleText = this.$deepClone(object?.oracleText ?? null);
        this._originalText = this.$deepClone(object?.originalText ?? null);
        this._type = this.$deepClone(object?.type ?? null);
        this._originalType = this.$deepClone(object?.originalType ?? null);

        if (setOriginal) {
            this._original = new CardClass(object, false);
        }

        return this;
    }

    get id(): number | null {
        return this._id;
    }
    set id(value: number | null) {
        this._id = value;
    }

    get cardHash(): string | null {
        return this._cardHash;
    }
    set cardHash(value: string | null) {
        this._cardHash = value;
    }

    get cardId(): string | null {
        return this._cardId;
    }
    set cardId(value: string | null) {
        this._cardId = value;
    }

    get cardNumber(): number | null {
        return this._cardNumber;
    }
    set cardNumber(value: number | null) {
        this._cardNumber = value;
    }

    get multiverseId(): number | null {
        return this._multiverseId;
    }
    set multiverseId(value: number | null) {
        this._multiverseId = value;
    }

    get collectionSet(): CollectionSetClass | null {
        return this._collectionSet;
    }
    set collectionSet(value: CollectionSetClass | null) {
        this._collectionSet = value;
    }

    get collectionSets(): CollectionSetClass[] | null {
        return this._collectionSets;
    }
    set collectionSets(value: CollectionSetClass[] | null) {
        this._collectionSets = value;
    }

    get colors(): ColorClass[] | null {
        return this._colors;
    }
    set colors(value: ColorClass[] | null) {
        this._colors = value;
    }

    get identityColors(): ColorClass[] | null {
        return this._identityColors;
    }
    set identityColors(value: ColorClass[] | null) {
        this._identityColors = value;
    }

    get supertypes(): SupertypeClass[] | null {
        return this._supertypes;
    }
    set supertypes(value: SupertypeClass[] | null) {
        this._supertypes = value;
    }

    get types(): TypeClass[] | null {
        return this._types;
    }
    set types(value: TypeClass[] | null) {
        this._types = value;
    }

    get subtypes(): SubtypeClass[] | null {
        return this._subtypes;
    }
    set subtypes(value: SubtypeClass[] | null) {
        this._subtypes = value;
    }

    get name(): string | null {
        return this._name;
    }
    set name(value: string | null) {
        this._name = value;
    }

    get cmc(): number | null {
        return this._cmc;
    }
    set cmc(value: number | null) {
        this._cmc = value;
    }

    get manaCost(): string | null {
        return this._manaCost;
    }
    set manaCost(value: string | null) {
        this._manaCost = value;
    }

    get power(): string | null {
        return this._power;
    }
    set power(value: string | null) {
        this._power = value;
    }

    get toughness(): string | null {
        return this._toughness;
    }
    set toughness(value: string | null) {
        this._toughness = value;
    }

    get loyalty(): string | null {
        return this._loyalty;
    }
    set loyalty(value: string | null) {
        this._loyalty = value;
    }

    get rarity(): string | null {
        return this._rarity;
    }
    set rarity(value: string | null) {
        this._rarity = value;
    }

    get layout(): string | null {
        return this._layout;
    }
    set layout(value: string | null) {
        this._layout = value;
    }

    get imageUrl(): string | null {
        return this._imageUrl;
    }
    set imageUrl(value: string | null) {
        this._imageUrl = value;
    }

    get artImageUrl(): string | null {
        return this._artImageUrl;
    }
    set artImageUrl(value: string | null) {
        this._artImageUrl = value;
    }

    get backsideImageUrl(): string | null {
        return this._backsideImageUrl;
    }
    set backsideImageUrl(value: string | null) {
        this._backsideImageUrl = value;
    }

    get latestImageUrl(): string | null {
        return this._latestImageUrl;
    }
    set latestImageUrl(value: string | null) {
        this._latestImageUrl = value;
    }

    get oracleText(): string | null {
        return this._oracleText;
    }
    set oracleText(value: string | null) {
        this._oracleText = value;
    }

    get originalText(): string | null {
        return this._originalText;
    }
    set originalText(value: string | null) {
        this._originalText = value;
    }

    get type(): string | null {
        return this._type;
    }
    set type(value: string | null) {
        this._type = value;
    }

    get originalType(): string | null {
        return this._originalType;
    }
    set originalType(value: string | null) {
        this._originalType = value;
    }
}