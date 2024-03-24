
import {EntityColumnType, EntityInterface} from "~/composables/entity/EntityInterface";
import {CollectionSet} from "~/composables/entity/CollectionSet";
import {ImageCollection} from "~/composables/entity/ImageCollection";

export type self = CardInterface;

export type CardType = {
    id: number,
    uniqueCardId: number,
    uniqueCardCode: string,
    cardId:string|null,
    cardNumber:number|null,
    multiverseId:number|null,
    name:string|null,
    cmc:number|null,
    power:number|null,
    toughness:number|null,
    loyalty:number|null,
    manaCost:string|null,
    rarity:string|null,
    type:string|null,
    imageUrl:string|null,
    oracleText:string|null,
    originalText:string|null,
    originalType:string|null,
    collectionSet:CollectionSet|null,
    layout:string|null,
    artist:string|null,
    colors:string[]|null,
    identityColors:string[]|null,
    supertypes:string[]|null,
    types:string[]|null,
    subtypes:string[]|null,
    collectionSets:CollectionSet[]|null,
    imageCollection:ImageCollection[]|null
};

export interface CardInterface extends EntityInterface {
    id: number;
    uniqueCardId: number;
    uniqueCardCode: string;
    cardId:string|null;
    cardNumber:number|null;
    multiverseId:number|null;
    name:string|null;
    cmc:number|null;
    power:number|null;
    toughness:number|null;
    loyalty:number|null;
    manaCost:string|null;
    rarity:string|null;
    type:string|null;
    imageUrl:string|null;
    oracleText:string|null;
    originalText:string|null;
    originalType:string|null;
    collectionSet:CollectionSet|null;
    layout:string|null;
    artist:string|null;
    colors:string[]|null;
    identityColors:string[]|null;
    supertypes:string[]|null;
    types:string[]|null;
    subtypes:string[]|null;
    collectionSets:CollectionSet[]|null;
    imageCollection:ImageCollection[]|null;

    // id: number;
    getId(): number;
    setId(value: number): self;
    // uniqueCardId: number;
    getUniqueCardId(): number;
    setUniqueCardId(value: number): self;
    // uniqueCardCode: string;
    getUniqueCardCode():string;
    setUniqueCardCode(value:string): self;
    // cardId:string|null;
    getCardId():string|null;
    setCardId(value:string|null): self;
    // cardNumber:number|null;
    getCardNumber():number|null;
    setCardNumber(value:number|null): self;
    // multiverseId:number|null;
    getMultiverseId():number|null;
    setMultiverseId(value:number|null): self;
    // name:string|null;
    getName():string|null;
    setName(value:string|null): self;
    // cmc:number|null;
    getCmc():number|null;
    setCmc(value:number|null): self;
    // power:number|null;
    getPower():number|null;
    setPower(value:number|null): self;
    // toughness:number|null;
    getToughness():number|null;
    setToughness(value:number|null): self;
    // loyalty:number|null;
    getLoyalty():number|null;
    setLoyalty(value:number|null): self;
    // manaCost:string|null;
    getManaCost():string|null;
    setManaCost(value:string|null): self;
    // rarity:string|null;
    getRarity():string|null;
    setRarity(value:string|null): self;
    // type:string|null;
    getType():string|null;
    setType(value:string|null): self;
    // imageUrl:string|null;
    getImageUrl():string|null;
    setImageUrl(value:string|null): self;
    // oracleText:string|null;
    getOracleText():string|null;
    setOracleText(value:string|null): self;
    // originalText:string|null;
    getOriginalText():string|null;
    setOriginalText(value:string|null): self;
    // originalType:string|null;
    getOriginalType():string|null;
    setOriginalType(value:string|null): self;
    // collectionSet:string|null;
    getCollectionSet():CollectionSet|null;
    setCollectionSet(value:CollectionSet|null):self;
    // layout:string|null;
    getLayout():string|null;
    setLayout(value:string|null): self;
    // artist:string|null;
    getArtist():string|null;
    setArtist(value:string|null): self;
    // colors:string[]|null;
    getColors():string[]|null;
    setColors(value:string[]|null): self;
    // identityColors:string[]|null;
    getIdentityColors():string[]|null;
    setIdentityColors(value:string[]|null): self;
    // supertypes:string[]|null;
    getSupertypes():string[]|null;
    setSupertypes(value:string[]|null): self;
    // types:string[]|null;
    getTypes():string[]|null;
    setTypes(value:string[]|null): self;
    // subtypes:string[]|null;
    getSubtypes():string[]|null;
    setSubtypes(value:string[]|null): self;
    // collectionSets:string|null;
    getCollectionSets():CollectionSet[]|null;
    setCollectionSets(value:CollectionSet[]|null):self;
    // imageCollection:ImageCollection[]|null;
    getImageCollection():ImageCollection[];
    setImageCollection(value:ImageCollection[]|null):self;

    getColumns(): EntityColumnType[];

    transformFromObject(object: {}): self
}