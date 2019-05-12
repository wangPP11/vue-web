export class User {

    name!:string;
    password!:string;
    kaptcha!:string;
    public  getName():string{
        return this.name;
    }

    public  setName(name:string): void{
        this.name = name;
    }

    public getPassword(): string {
        return this.password;
    }

    public setPassword(password: string) {
        this.password = password;
    }

    public getKaptcha():string{
        return this.kaptcha;
    }

    public setKaptcha(kaptcha: string){
        this.kaptcha = kaptcha;
    }
    constructor(name: string, password: string, kaptcha: string) {
        this.name = name;
        this.password = password;
        this.kaptcha = kaptcha;
    }
}
