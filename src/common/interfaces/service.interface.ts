import { Document, WithId } from "mongodb";

export interface ServiceInterface<T> {

    create(data: Document | T): Promise<QueryResult>

    findAll(query?: QueryOptions): Promise<getAllResult<T>>

    findOne(query: QueryOptions): Promise<T | WithId<Document> | QueryResult>

    count(query: QueryFilter): Promise<number | QueryResult>;

    update(filter: QueryFilter, data: Document): Promise<QueryResult>;

    generateExportLinks(filters: QueryFilter, link: string): Promise<{ xlsxPath: string, pdfPath: string }>;

    getDataToExport(code: string): Promise<Error | getAllResult<T>>

}



declare type ObjectType<T> = {
    [key: string]: T
}

declare type QueryOptions = {
    filter?: QueryFilter,
    projection?: QueryProjection,
    limit?: number,
    offset?: number,
    sort?: string,
    way?: 1 | -1,
}

declare type QueryFilter = ObjectType<unknown>

declare type QueryProjection = ObjectType<number>

declare type getAllResult<T> = {
    data: T[],
    count: number
}

declare type QueryResult = {
    status?: number;
    message?: string;
    data?: unknown;
}
