export class StringUtils {
    static isEntity(s:string):boolean {
        if (s == null || s == undefined || s.length == 0)
            return true;
        return false;
    }
}
