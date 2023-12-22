import { Document, InsertOneResult, UpdateResult, WithId, InsertManyResult, DeleteResult } from "mongodb";

export interface RepositoryInterface {

    create(data: Document): Promise<InsertOneResult<Document>>;

    createMany(documents: Document[]): Promise<InsertManyResult<Document>>;

    findAll(query?: QueryOptions): Promise<Document[]>;

    findOne(query: QueryOptions): Promise<WithId<globalThis.Document> | null>;

    findAllAggregate(agregation: any): Promise<Document[]>;

    count(query: QueryFilter): Promise<number>;

    update(filter: QueryFilter, data: Document, unsetDocument: Document): Promise<UpdateResult>;

    updateMany(filter: QueryFilter, setDocument: Document, unsetDocument: Document): Promise<UpdateResult>;

    deleteOne(filter: QueryFilter): Promise<DeleteResult>;

    deleteMany(filter: QueryFilter): Promise<DeleteResult>;
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

declare type QueryProjection = ObjectType<0 | 1 | number>
