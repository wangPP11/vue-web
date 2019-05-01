export class User {
    name!:string;
    password!:string;

    public  getName():string{
        return this.name;
    }

    public  setName(name:string): void{
        this.name = name;
    }

    public getPassword(): string {
        return this.password;
    }

    public setPassword(value: string) {
        this.password = value;
    }

    constructor(name: string, password: string) {
        this.name = name;
        this.password = password;
    }
}
