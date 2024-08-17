

export class EntityClass {
    private _instantiated:boolean = true;
    private _changesApplied:boolean = false;
    constructor() {}

    get changesApplied(): boolean {
        return this._changesApplied;
    }

    set changesApplied(value: boolean) {
        this._changesApplied = value;
    }

    get instantiated(): boolean {
        return this._instantiated;
    }

    $deepClone(data:any) {
        return JSON.parse(JSON.stringify(data));
    }
}