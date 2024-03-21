

export type AppTableColumnType = {
  column:string,
  slot?:string,
  hidden?:boolean,
  label?:string,
  width?:string,
  main?:boolean,
  sort?:boolean|number|string,
  dataType?:string,
  searchable?:boolean
}