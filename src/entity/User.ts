export class User {
    id!: number;
    name!:string;
    password!:string;
    kaptcha!:string;
    roleIds!:Array<number>;

    constructor() {
        this.name = "";
        this.password = "";
        this.kaptcha = "";
        this.roleIds = [];
    }
}
