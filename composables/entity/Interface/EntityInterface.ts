
/**
 * interface EntityInterface definition
 *
 * types
 *
 * fields
 * constructor
 * getters/setters
 * extras
 */

export type oEntity = {
    id:number
};

export interface EntityInterface {

    get id():number|null
    set id(value:number|null)

    getObject(simple?:boolean):any
}