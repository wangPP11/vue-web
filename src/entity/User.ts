export class User {

    private name!:string;
    private password!:string;
    private kaptcha!:string;

    constructor(name: string, password: string, kaptcha: string) {
        this.name = name;
        this.password = password;
        this.kaptcha = kaptcha;
    }
}
