export class User {
    phone!:string;
    password!:string;

    public getPhone(): string {
        return this.phone;
    }

    public setPhone(value: string) {
        this.phone = value;
    }

    public getPassword(): string {
        return this.password;
    }

    public setPassword(value: string) {
        this.password = value;
    }

    constructor(phone: string, password: string) {
        this.phone = phone;
        this.password = password;
    }
}
