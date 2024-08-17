import {EntityInterface} from "~/composables/entity/Interface/EntityInterface";

export type oColor = {
    id:number|null,
    code:string|null,
    mtgCode:string|null,
    name:string|null,
    colorOrder:number|null,
};

export interface ColorInterface extends EntityInterface {
    id:number|null;
    code:string|null;
    mtgCode:string|null;
    name:string|null;
    colorOrder:number|null;
}