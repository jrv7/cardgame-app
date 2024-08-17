import {EntityInterface} from "~/composables/entity/Interface/EntityInterface";
import {oColor} from "~/composables/entity/Interface/ColorInterface";
import {ColorClass} from "~/composables/entity/Class/ColorClass";
import {oCollectionSet} from "~/composables/entity/Interface/CollectionSetInterface";
import {CollectionSetClass} from "~/composables/entity/Class/CollectionSetClass";
import {oSupertype} from "~/composables/entity/Interface/SupertypeInterface";
import {oType} from "~/composables/entity/Interface/TypeInterface";
import {oSubtype} from "~/composables/entity/Interface/SubtypeInterface";
import {SupertypeClass} from "~/composables/entity/Class/SupertypeClass";
import {TypeClass} from "~/composables/entity/Class/TypeClass";
import {SubtypeClass} from "~/composables/entity/Class/SubtypeClass";

export type oCard = {
    id:number|null,
    cardHash:string|null,
    cardId:string|null,
    cardNumber:number|null,
    multiverseId:number|null,
    collectionSet:oCollectionSet|null,
    collectionSets:oCollectionSet[]|null,
    colors:oColor[]|null,
    identityColors:oColor[]|null,
    supertypes:oSupertype[]|null,
    types:oType[]|null,
    subtypes:oSubtype[]|null,
    name:string|null,
    cmc:number|null,
    manaCost:string|null,
    power:string|null,
    toughness:string|null,
    loyalty:string|null,
    rarity:string|null,
    layout:string|null,
    imageUrl:string|null,
    artImageUrl:string|null,
    backsideImageUrl:string|null,
    latestImageUrl:string|null,
    oracleText:string|null,
    originalText:string|null,
    type:string|null,
    originalType:string|null,
};

export interface CardInterface extends EntityInterface {
    id:number|null;
    cardHash:string|null;
    cardId:string|null;
    cardNumber:number|null;
    multiverseId:number|null;
    collectionSet:CollectionSetClass|null;
    collectionSets:CollectionSetClass[]|null;
    colors:ColorClass[]|null;
    identityColors:ColorClass[]|null;
    supertypes:SupertypeClass[]|null;
    types:TypeClass[]|null;
    subtypes:SubtypeClass[]|null;
    name:string|null;
    cmc:number|null;
    manaCost:string|null;
    power:string|null;
    toughness:string|null;
    loyalty:string|null;
    rarity:string|null;
    layout:string|null;
    imageUrl:string|null;
    artImageUrl:string|null;
    backsideImageUrl:string|null;
    latestImageUrl:string|null;
    oracleText:string|null;
    originalText:string|null;
    type:string|null;
    originalType:string|null;
}