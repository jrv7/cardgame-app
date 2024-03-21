import {AppTableColumnType} from "~/composables/customTypes/AppTableColumnType";


export type AppTablePaginationType = {
  page:number,
  pages:number,
  pageSize:number,
  from:number,
  to:number,
  count:number,
  total:number,
  filtered:boolean,
  sort?:AppTableColumnType
}