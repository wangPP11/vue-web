export class Role{
  id!:number;
  name!:string;
  parentId!:number;
  menuIds!: Array<number>;
  childs!: Array<Role>;
  parentName!: string;

  constructor() {
    this.name = "";
    this.parentId = 0;
    this.menuIds = [];
    this.childs = [];
    this.parentName = "";
  }
}
