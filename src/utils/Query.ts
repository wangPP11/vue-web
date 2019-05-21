export class Query {
    currentPage: number = 1;
    pageSize: number = 10;
    isAsc: boolean = true;
    orderFields: string = "id";
    total: number = 0;
    value: string = "";
    type: string = "";
}
