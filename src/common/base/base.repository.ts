import { Collection, Document, InsertOneResult, InsertManyResult, ObjectId, UpdateResult, WithId, DeleteResult, UpdateQuery } from 'mongodb';
import { RepositoryInterface } from '../interfaces';
import * as db from 'database/mongodb';
import { isEmpty } from 'lodash';

export class BaseRepository implements RepositoryInterface {
  protected collectionName: string = '';

  constructor() {
    if (!this.collectionName)
      this.collectionName = this.getCollectionName();
  }

  async create(document: globalThis.Document): Promise<InsertOneResult<globalThis.Document>> {
    try {
      return (await this.getCollection()).insertOne(document);
    } catch (error) { throw error; }
  }

  async createMany(documents: globalThis.Document[]): Promise<InsertManyResult<globalThis.Document>> {
    try {
      return (await this.getCollection()).insertMany(documents);
    } catch (error) { throw error; }
  }

  async findAll(query?: QueryOptions): Promise<Document[]> {
    try {
      return (await this.getCollection())
        .find(query?.filter ?? {})
        .project(query?.projection ?? {})
        .sort(query?.sort ?? '_id', query?.way ?? -1)
        .skip(((query?.offset || 1) - 1) * (query?.limit || 0))
        .limit(query?.limit ?? 0)
        .toArray();
    } catch (error) { throw error; }
  }

  async findAllAggregate(agregation: any): Promise<Document[]> {
    try {
      return (await this.getCollection()).aggregate(agregation ?? []).toArray();
    } catch (error) { throw error; }
  }

  async findOne(query: QueryOptions): Promise<WithId<globalThis.Document> | null> {
    try {
      console.log('this.collectionName: ', this.collectionName);

      this.setMongoId(query.filter || {});

      return (await this.getCollection()).findOne(query.filter || {}, { projection: query.projection ?? {} });
    } catch (error) { throw error; }
  }

  async count(query: QueryFilter): Promise<number> {
    try {
      return (await this.getCollection()).countDocuments(query);
    } catch (error) { throw error; }
  }

  async update(filter: QueryFilter, document: Document, unsetDocument: Document): Promise<UpdateResult> {
    try {
      this.setMongoId(filter);

      const updateQuery: UpdateQuery<any> = { $set: document };
      if (unsetDocument) { updateQuery.$unset = unsetDocument; }
      return (await this.getCollection()).updateOne(filter, updateQuery);
    } catch (error) { throw error; }
  }

  async updateMany(filter: QueryFilter, setDocument: Document, unsetDocument: Document): Promise<UpdateResult> {
    try {
      this.setMongoId(filter);

      const updateFilter = {};
      if (!isEmpty(setDocument)) updateFilter.$set = setDocument;
      if (!isEmpty(unsetDocument)) updateFilter.$unset = unsetDocument;
      return (await this.getCollection()).updateMany(filter, updateFilter);
    } catch (error) { throw error; }
  }

  async deleteOne(filter: QueryFilter): Promise<DeleteResult> {
    try {
      this.setMongoId(filter);

      return (await this.getCollection()).deleteOne(filter);
    } catch (error) { throw error; }
  }

  async deleteMany(filter: QueryFilter): Promise<DeleteResult> {
    try {
      this.setMongoId(filter);

      return (await this.getCollection()).deleteMany(filter);
    } catch (error) { throw error; }
  }

  protected async getCollection(): Promise<Collection<globalThis.Document>> {
    try {
      return await db.getCollection(this.collectionName);
    } catch (error) { throw error; }
  }

  private getCollectionName(): string {
    const name = this.constructor.name.replace('Repository', '').toLowerCase();

    if (name.slice(-1) == 'y') return name.replace('y', 'ies');

    return name;
  }

  private setMongoId(filter: QueryFilter = {}): void {
    if ('_id' in filter && filter?._id?.toString()?.length === 24)
      filter._id = new ObjectId(filter?._id?.toString());
  }
}


declare type ObjectType<T> = {
  [key: string]: T
}

export declare type QueryOptions = {
  filter?: QueryFilter,
  projection?: QueryProjection,
  limit?: number,
  offset?: number,
  sort?: string,
  way?: 1 | -1,
}

export declare type QueryFilter = ObjectType<any>

export declare type QueryProjection = ObjectType<0 | 1 | number>
