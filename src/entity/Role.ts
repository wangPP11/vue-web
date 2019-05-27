export class Role{
  id!:number;
  name!:string;
  parenId!:number;
  menuIds!: Array<number>;
  childs!: Array<Role>;
  parentName!: string;

  constructor() {
    this.name = "";
    this.parenId = 0;
    this.menuIds = [];
    this.childs = [];
    this.parentName = "";
  }
}