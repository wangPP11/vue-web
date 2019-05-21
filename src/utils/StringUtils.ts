export class StringUtils {
    static isEntity(s:string):boolean {
        if (s == null || s == undefined || s.length == 0)
            return true;
        return false;
    }

    static isNotEntity(s:string):boolean {
        return this.isEntity(s);
    }

    static isBlank(s:any):boolean {
        if (s == null || s == undefined || s.toString().length == 0)
            return true;
        return false;
    }

    static isNotBlank(s:any):boolean {
        return this.isBlank(s);
    }

    static isPermisson(s: string): boolean{
        let isPerm: boolean  = false;
        let permissionList = localStorage.getItem("permissionList");
        if (permissionList == null) {
            return isPerm;
        }
        let list = JSON.parse(permissionList.toString());
        for (let index in list) {
            if (s == list[index]) {
                isPerm = true;
                break;
            }
        }
        return isPerm;
    }
}

