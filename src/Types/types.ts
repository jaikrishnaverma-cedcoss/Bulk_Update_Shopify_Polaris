
export interface productsTypes{
    id:number,
    [key:string]:any
}
export interface initialTypes{
    products:productsTypes[]
    persistProducts:string,
    selected:number[],
    editActive:string,
}
export interface colPropType {
    item: productsTypes;
    changeValUi:(val:any,key:string)=>any
  }