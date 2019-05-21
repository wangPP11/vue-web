export class User {

    name!:string;
    password!:string;
    kaptcha!:string;

    constructor(name: string, password: string, kaptcha: string) {
        this.name = name;
        this.password = password;
        this.kaptcha = kaptcha;
    }
}
