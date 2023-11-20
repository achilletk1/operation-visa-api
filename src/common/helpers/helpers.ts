import { config } from 'convict-config';
import handlebars from 'handlebars';
import { Response } from 'express';
import { isString } from 'lodash';
import moment from 'moment';

export const isProd = ['production'].includes(config.get('env'));

export const isDev = ['development'].includes(config.get('env'));

export const isStaging = ['staging'].includes(config.get('env'));

export const isStagingBci = ['staging-bci'].includes(config.get('env'));

export const isDevOrStag = ['development', 'staging'].includes(config.get('env'));

export const isProdOrStag = ['production', 'staging-bci', 'staging'].includes(config.get('env'));

export const extractPaginationData = (query: QueryOptions): QueryOptions => {
  setParam('offset', query);
  setParam('limit', query);

  return query
}

export const extractSortingData = (query: QueryOptions): QueryOptions => {
  setParam('sort', query);
  setParam('way', query);

  return query
}

export const extractProjectionData = (query: QueryOptions): QueryOptions => {
  setParam('projection', query);

  if (typeof query?.projection == 'string')
    query.projection = setProjection(query.projection as unknown as string);

  return query;
}

function setParam(param: FilterParam, query: QueryOptions) {
  if (query?.filter && `${param}` in query.filter) {
    query[`${param}`] = query.filter[param];
    delete query.filter[param];
  }
}

function setProjection(field: string) {
  return field.split(',').reduce((o, key) => ({ ...o, [key]: 1 }), {});
}

export const setResponse = (status: number, message: string, data?: unknown): QueryResult => {
  return (data) ? { status, message, data } : { status, message };
}

export const rangeData = (query: any): any => {
  const { start, end } = query?.filter || {};
  delete query?.filter?.start;
  delete query?.filter?.end;
  if (start && end) query.filter['created_at'] = { $gte: moment(start, 'YYYY-MM-DD').startOf('day').valueOf(), $lte: moment(end, 'YYYY-MM-DD').endOf('day').valueOf() };

  return query
}

export const getRandomString = (size: number, numberOnly?: boolean) => {
  size = size || 10;
  const chars = numberOnly ?
    '0123456789' :
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ';
  let randomstring = '';
  for (let i = 0; i < size; i++) {
    const rnum = Math.floor(Math.random() * chars.length);
    randomstring += chars.substring(rnum, rnum + 1);
  }
  return randomstring;
}

export function parseNumberFields(fields?: any) {
  for (const key in fields) {
    if (!fields.hasOwnProperty(key)) { continue; }
    if (RegExp(/[a-z]/i).test(fields[key])) { continue; }
    if (key === 'internalRef') { fields[key] = `${fields[key]}`.trim(); continue; }
    if (key.includes('niu')) { fields[key] = `${fields[key]}`.trim(); continue; }
    if (key.includes('clientCode')) { fields[key] = `${fields[key]}`.trim(); continue; }
    if (key.includes('contryCode')) { fields[key] = `${fields[key]}`.trim(); continue; }
    if (key.includes('bankCode')) { fields[key] = `${fields[key]}`.trim(); continue; }
    if (key.includes('tel')) { fields[key] = `${fields[key]}`.trim(); continue; }
    if (key.includes('ncp')) { fields[key] = `${fields[key]}`.trim(); continue; }
    if (key.includes('originator.ncp')) { fields[key] = `${fields[key]}`.trim(); continue; }
    if (key.includes('country.code')) { fields[key] = `${fields[key]}`.trim(); continue; }
    if (key.includes('age')) { fields[key] = `${fields[key]}`.trim(); continue; }
    if (key.includes('vouchercode')) { fields[key] = `${fields[key]}`.trim(); continue; }
    fields[key] = (isString(fields[key]) && /^[0-9]+$/.test(fields[key])) ? +fields[key] : fields[key];
  }

}

export function replaceVariables(content: any, values: any, isSms?: boolean, isTest?: boolean) {
  const obj: any = {};
  for (const key in content) {
    if (!content.hasOwnProperty(key)) { break; }
    obj[key] = goToTheLine(formatContent(content[key], values, isTest), isSms);
  }
  return obj;
}

const formatContent = (str: string, values: any, isTest?: boolean): string => {
  if (!str) return '';

  if (isTest) {
    str = str.split(`{{`).join(`[`);
    str = str.split(`}}`).join(`]`);
    return str;
  }
  for (const key in values)
    if (str.includes(`{{${key}}}`)) str = str.split(`{{${key}}}`).join(`${values[key]}`);

  return str;
}

const goToTheLine = (str: string, isSms?: boolean) => {
  const reg = '//';
  str = str ?? '';
  return str.includes(reg) ? isSms ? str.replace(new RegExp(reg, 'g'), '\n') : new handlebars.SafeString(str.split(reg).join('<br>')) : str;
}

// export const setResponseController = (data?: unknown): QueryResult => {
//   if (data?.error || data instanceof Error) {
//     throw new HttpException(data?.message || data?.name, data?.statusCode || data?.status || 500);
//   }
//   return data;
// }
class httpError {
  code = 500;
  message = 'internal server error';
  stack: unknown;
}

export class httpForbidden extends httpError {
  constructor(message: string, stack = null) {
    super();
    this.code = 403;
    this.message = message
    this.stack = stack;
  }
}

export const convertParams = (query: QueryOptions): QueryOptions => {
  if (query.filter) {
    for (const key in query.filter) {
      if (['true'].includes(query.filter[key])) { query.filter[key] = true; }
      if (query.filter[key] === 'false') { query.filter[key] = false; }
      if (RegExp(/[a-z]/i).test(query.filter[key])) { continue; }
      query.filter[key] = !isNaN(query.filter[key]) ? +query.filter[key] : query.filter[key];
    }
  }

  if (query.limit) { query.limit = +query.limit; }
  if (query.offset) { query.limit = +query.offset; }

  return query;
}

export function responseWithAttachment(res: Response, contentType: string, fileName: string, contentFile: any): void {
  res.setHeader('Content-Type', contentType);
  res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
  res.send(contentFile);
};

export function timeout(ms: number) { return new Promise(resolve => setTimeout(resolve, ms)); }

export enum QueueState {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
};

export class Queue {

  private _state = QueueState.PENDING;

  constructor() { }

  public get state() {
    return this._state;
  }
  public set state(value) {
    this._state = value;
  }

};

export function formatNumber(strNumber: string | number): string {
  const isStringe = typeof strNumber === 'string';
  if (!isStringe) { strNumber = strNumber.toString(); }
  strNumber = String(strNumber).replace(/ /g, '');
  strNumber = String(strNumber).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return strNumber;
};

export function getYearMonthLabel(str: string, type: 'year' | 'month' | 'both'): string {
  if (!str) { return ''; }
  str = str.toString();
  const months = { '01': 'Janvier', '02': 'Février', '03': 'Mars', '04': 'Avril', '05': 'Mai', '06': 'Juin', '07': 'Juillet', '08': 'Août', '09': 'Septembre', '10': 'Octobre', '11': 'Novembre', '12': 'Décembre' };
  const month = str?.slice(str.length - 2) as '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10' | '11' | '12';
  const year = str?.slice(0, str.length - 2);

  const data: { year: string; month: string; both: string; } = { year, month: months[month], both: `${months[month]} ${year}` };
  return data[type];
};

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

declare type QueryProjection = ObjectType<number>


declare type PaginationParam = 'offset' | 'limit';

declare type SortingParam = 'sort' | 'way';

declare type FilterParam = (PaginationParam & SortingParam & 'projection') extends keyof QueryOptions ? PaginationParam | SortingParam | 'projection' : never;

declare type QueryResult = {
  status?: number;
  message?: string;
  data?: unknown;
}
