export type EntityColumnType = {column: string, alias: string, hidden: boolean};

export interface EntityInterface {
    id: number;
    getColumns(): EntityColumnType[];
    getDefaultText(): string;
}