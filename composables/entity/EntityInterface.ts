import {UploadedFileInterface} from "~/composables/entity/UploadedFileInterface";

export type EntityColumnType = {column: string, alias: string, hidden: boolean};

export interface EntityInterface {
    id: number|string;
    getColumns(): EntityColumnType[];
    getDefaultText(): string;
    getDefaultImage(): UploadedFileInterface | string | null;
    getData(column?:string): any;
}