export class Menu {
    id!: number;
    name!: string;
    type!: string;
    permission!: string;
    url!: string;
    parentId!: string;
    parentName!: string;
    icon!: string;
    childs!: Array<Menu>;

    constructor(name: string, type: string, permission: string, url: string, parentId: string, parentName: string) {
        this.name = name;
        this.type = type;
        this.permission = permission;
        this.url = url;
        this.parentId = parentId;
        this.parentName = parentName;
        this.icon = "";
    }
}
