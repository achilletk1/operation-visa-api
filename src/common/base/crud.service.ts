
import { convertParams, extractPaginationData, extractProjectionData, extractSortingData, setResponse, rangeData, formatFilters } from '../helpers';
import { BaseRepository } from './base.repository';
import { ServiceInterface } from '../interfaces';
import { BaseService } from './base.service';
import { errorMsg, respMsg } from 'common';
import { config } from 'convict-config';
import { Document, ObjectId } from 'mongodb';
import moment from 'moment';

import crypt from 'url-crypt';

const URLCrypt = crypt(config.get('exportSalt'));

export class CrudService<T> extends BaseService implements ServiceInterface<T>  {

  constructor(protected readonly baseRepository: BaseRepository) {
    super();
  }

  async create(data: T | any): Promise<QueryResult> {
    try {
      data.enabled ??= true;
      data.created_at ??= moment().valueOf();

      const newDocument = await this.baseRepository.create(data as globalThis.Document);

      if (!newDocument.insertedId)
        throw new Error(errorMsg.ON_CREATION);

      return setResponse(200, respMsg.CREATED, newDocument.insertedId);
    } catch (error) { throw error; }
  }

  async createMany(documents: T[] | any[]): Promise<QueryResult> {
    try {
      documents = documents.map(elt => {
        elt.enable ??= true;
        elt.created_at ??= moment().valueOf();
        return elt;
      });
      const newDocument = await this.baseRepository.createMany(documents as globalThis.Document[]);

      if (!newDocument?.insertedCount || newDocument?.insertedCount === 0)
        throw new Error(errorMsg.ON_CREATION);

      return setResponse(200, respMsg.CREATED, newDocument?.insertedIds);
    } catch (error) { throw error; }
  }

  async findAll(query?: QueryOptions): Promise<getAllResult<T>> {
    try {
      query = convertParams(query || {});
      query = extractPaginationData(query || {});
      query = extractSortingData(query || {});
      query = extractProjectionData(query || {});
      query = rangeData(query);

      const data = (await this.baseRepository.findAll(query || {}) || []) as unknown as T[];
      const total = await this.count(query?.filter || {}) || 0;

      return { data, total };

    } catch (error) { throw error; }
  }

  async findAllAggregate(aggregation: object[]): Promise<Document[]> {
    try {
      return await this.baseRepository.findAllAggregate(aggregation ?? []);
    } catch (error) { throw error; }
  }

  async findOne(query: QueryOptions): Promise<T> {
    try {
      const document = await this.baseRepository.findOne(query);

      if (!document) throw new Error(errorMsg.NOT_FOUND + ' ' + JSON.stringify(query.filter));

      return document as T;
    } catch (error) { throw error; }
  }

  async count(filter: QueryFilter): Promise<number> {
    try {
      const numberOfDocuments = await this.baseRepository.count(filter);

      return numberOfDocuments;
    } catch (error) { throw error; }
  }

  async update(filter: QueryFilter, data: Document, unsetData?: Document): Promise<QueryResult> {
    try {
      // const existVerify = await this.baseRepository.findOne({ filter });
      // if (!existVerify) throw new Error(errorMsg.NOT_FOUND + ' ' + JSON.stringify(filter));
      delete data?._id;

      const updatedDocument = await this.baseRepository.update(filter, data, unsetData || {});

      // if (!updatedDocument.acknowledged)
      //   throw new Error(errorMsg.ON_UPDATE);

      return setResponse(updatedDocument.acknowledged ? 200 : 300, respMsg.UPDATED, updatedDocument);
    } catch (error) { throw error; }
  }

  async updateMany(filter: QueryFilter, data: Document, unsetData: Document): Promise<QueryResult> {
    try {
      // const existVerify = await this.baseRepository.findOne({ filter });
      // if (!existVerify) throw new Error(errorMsg.NOT_FOUND + ' ' + JSON.stringify(filter));
      delete data?._id;

      const updatedDocument = await this.baseRepository.updateMany(filter, data, unsetData);

      // if (!updatedDocument.acknowledged)
      //   throw new Error(errorMsg.ON_UPDATE);

      return setResponse(updatedDocument.acknowledged ? 200 : 300, respMsg.UPDATED, updatedDocument);
    } catch (error) { throw error; }
  }

  async deleteOne(filter: QueryFilter): Promise<QueryResult> {
    try {
      // const existVerify = await this.baseRepository.findOne({ filter });
      // if (!existVerify) throw new Error(errorMsg.NOT_FOUND + ' ' + JSON.stringify(filter));

      const deletedResult = await this.baseRepository.deleteOne(filter);

      // if (!deletedResult.acknowledged)
      //   throw new Error(errorMsg.ON_DELETE);

      return setResponse(deletedResult.acknowledged ? 200 : 300, respMsg.DELETED, deletedResult);
    } catch (error) { throw error; }
  }

  async deleteMany(filter: QueryFilter): Promise<QueryResult> {
    try {
      // const existVerify = await this.baseRepository.findOne({ filter });
      // if (!existVerify) throw new Error(errorMsg.NOT_FOUND + ' ' + JSON.stringify(filter));

      const deletedResult = await this.baseRepository.deleteMany(filter);

      // if (!deletedResult.acknowledged)
      //   throw new Error(errorMsg.ON_DELETE);

      return setResponse(deletedResult.acknowledged ? 200 : 300, respMsg.DELETED, deletedResult);
    } catch (error) { throw error; }
  }

  async generateExportLinks(filters: QueryFilter, link: string): Promise<{ xlsxPath: string, pdfPath: string }> {

    filters = formatFilters(filters);

    const xlsxCode = URLCrypt.cryptObj({ format: 'xlsx', ...filters });

    const basePath = `${config.get('baseUrl')}${config.get('basePath')}/${link}/export`;

    return {
      xlsxPath: `${basePath}/${xlsxCode}`,
      pdfPath: ''
    };
  }

  async getDataToExport(code: string): Promise<getAllResult<T>> {

    let options;

    try {
      options = URLCrypt.decryptObj(code);
    } catch (error) { throw new Error('BadExportCode'); }

    const { start, end, ttl } = options;
    delete options.start;
    delete options.end;
    delete options.ttl;
    delete options.format;

    if ((new Date()).getTime() >= ttl) { throw new Error('ExportLinkExpired'); }

    const range = (start && end) ? { start, end } : '';

    return await this.findAll({ filter: { ...options, ...range } });
  }

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

declare type QueryFilter = ObjectType<any>

declare type QueryProjection = ObjectType<0 | 1 | number>

declare type getAllResult<T> = {
  data: T[],
  total: number
}

declare type QueryResult = {
  status?: number;
  message?: string;
  data?: any;
}

