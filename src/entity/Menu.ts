export class Menu {
    id!: number;
    name!: string;
    type!: number;
    permission!: string;
    url!: string;
    parentId!: number;
    parentName!: string;
    icon!: string;
    childs!: Array<Menu>;

    constructor() {
        this.name = "";
        this.type = 0;
        this.permission = "";
        this.url = "";
        this.parentId = 0;
        this.parentName = "";
        this.icon = "";
        this.childs = [];
    }
}
