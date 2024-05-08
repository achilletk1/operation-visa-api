import { VisaOperationsAttachment, OpeVisaStatus, Validator } from 'modules/visa-operations';
import { isEmpty, isEqual, isObject, isString, transform } from 'lodash';
import { OnlinePaymentMonth } from 'modules/online-payment';
import { TravelMonth } from 'modules/travel-month';
import { Voucher } from 'modules/vouchers';
import { Travel } from 'modules/travel';
import { config } from 'convict-config';
import { logger } from 'winston-config';
import { User } from 'modules/users';
import handlebars from 'handlebars';
import { Response } from 'express';
import moment from 'moment';
import XLSX from 'xlsx';

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
  let randomString = '';
  for (let i = 0; i < size; i++) {
    const rowNum = Math.floor(Math.random() * chars.length);
    randomString += chars.substring(rowNum, rowNum + 1);
  }
  return randomString;
}

export function parseNumberFields(fields?: any) {
  for (const key in fields) {
    if (!fields.hasOwnProperty(key)) { continue; }
    if (RegExp(/[a-z]/i).test(fields[key])) { continue; }
    if (
      key === 'internalRef' ||
      key.includes('niu') ||
      key.includes('tel') ||
      key.includes('ncp') ||
      key.includes('age') ||
      key.includes('bankCode') ||
      key.includes('clientCode') ||
      key.includes('contryCode') ||
      key.includes('vouchercode') ||
      key.includes('country.code') ||
      key.includes('travelType') ||
      key.includes('start') ||
      key.includes('end') ||
      key.includes('regionCode') ||
      key.includes('originator.ncp')
    ) {
        if(key.includes('travelType')) {
          fields[key] = Number(fields[key]); continue;
        }
        fields[key] = `${fields[key]}`.trim(); continue;
    }
    fields[key] = (isString(fields[key]) && /^\d+$/.test(fields[key])) ? +fields[key] : fields[key];
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
    if (str?.includes(`{{${key}}}`)) str = str?.split(`{{${key}}}`).join(`${values[key]}`);

  return str;
}

export const goToTheLine = (str: string, isSms?: boolean) => {
  const reg = '//';
  str = str ?? '';
  const regExpress = isSms ? str?.replace(new RegExp(reg, 'g'), '\n') : new handlebars.SafeString(str?.split(reg).join('<br>'));
  return str?.includes(reg) ? regExpress : str;
}

// export const setResponseController = (data?: unknown): QueryResult => {
//   if (data?.error || data instanceof Error) {
//     throw new HttpException(data?.message || data?.name, data?.statusCode || data?.status || 500);
//   }
//   return data;
// }
class HttpError {
  code = 500;
  message = 'internal server error';
  stack: unknown;
}

export class HttpForbidden extends HttpError {
  constructor(message: string, stack = null) {
    super();
    this.code = 403;
    this.message = message
    this.stack = stack;
  }
}

export const convertParams = (query: QueryOptions): QueryOptions => {

  query.limit && (query.limit = +query.limit);

  query.offset && (query.offset = +query.offset);

  if (!query.filter) { return query; }

  for (const key in query.filter) {
    if ('excepts' in query.filter && query.filter.excepts.includes(key)) continue;
    (['true'].includes(query.filter[key])) && (query.filter[key] = true);
    (query.filter[key] === 'false') && (query.filter[key] = false);
    if (RegExp(/[a-z]/i).test(query.filter[key]) || ['user.clientCode', 'user.cbsCategory'].includes(key)) {
      continue;
    }
    query.filter[key] = !isNaN(query.filter[key]) ? +query.filter[key] : query.filter[key];
  }

  delete query.filter?.excepts;

  return query;
}

export function responseWithAttachment(res: Response, contentType: string, fileName: string, contentFile: any): void {
  res.setHeader('Content-Type', contentType);
  res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
  res.send(contentFile);
};

export function timeout(ms: number) { return new Promise(resolve => setTimeout(resolve, ms)); }

export function removeSpacesFromResultSet(resultSet: any) {
  const obj: any = {};
  try {
    // tslint:disable-next-line: forin
    for (const key in resultSet) {
      if (!resultSet.hasOwnProperty(key)) { break; }
      obj[key] = (typeof resultSet[key] === 'string')
        ? resultSet[key].trim().replace(/[�]/g, '°')
        : resultSet[key];
      if (key === 'TEL' && typeof resultSet[key] === 'string') { obj[key] = obj[key].replace(/[+]/g, '') }
    }
  } catch (error) { logger.error('failed to remove spaces from resultset', { error }); }

  return isEmpty(obj) ? resultSet : obj;
}

export enum QueueState {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
};

export class Queue {

  private _state = QueueState.PENDING;

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

export function excelToJson(content: any) {
  const wb = XLSX.read(content);
  const sheetNames = wb.SheetNames;

  return XLSX.utils.sheet_to_json(wb.Sheets[sheetNames[0]], { raw: true });
};

export function generateAttachmentFromVoucher(voucher: Voucher, withoutVoucherId: boolean = false): VisaOperationsAttachment {
  const attachment: VisaOperationsAttachment = {
    label: voucher?.label,
    fileName: '',
    name: '',
    contentType: undefined,
    content: null,
    path: '',
    dates: {
      created: undefined,
      updated: undefined,
    },
    isRequired: voucher?.isRequired ?? false,
    extension: voucher?.extension ?? '*',
  };
  if (!withoutVoucherId) { attachment.voucherId = voucher?._id; }
  return attachment;
}

export function generateValidator(validator: Validator, user: User, status: OpeVisaStatus, rejectReason: string, signature?: string, indexes?: number[]): Validator {
  return {
    _id: validator?._id,
    fullName: user?.fullName ?? `${user?.fname} ${user?.lname}`,
    clientCode: user?.clientCode,
    userCode: user?.userCode,
    signature: signature ?? undefined,
    date: new Date().valueOf(),
    status,
    rejectReason: rejectReason ?? undefined,
    level: validator.level,
    indexes
  };
}

export function getValidationsFolder(folder: Travel | OnlinePaymentMonth | TravelMonth) {
  const validators = [];
  if ('proofTravel' in folder && folder.proofTravel && 'validators' in folder.proofTravel) {
    folder.proofTravel?.validators?.forEach(elt => { /*elt.status = travel?.proofTravel?.status;*/ elt.step = 'Preuve de voyage' })
    validators.push(...folder.proofTravel?.validators ?? []);
  }

  if ('validators' in folder) {
    folder?.validators?.forEach(elt => { elt.step = 'État détaillé des dépenses' })
    validators.push(...folder?.validators ?? []);
  }
  return validators;
}

export function getPartialUser(user: User): Partial<User> {
  return {
    _id: user._id,
    clientCode: user.clientCode,
    email: user.email,
    tel: user.tel,
    gender: user.gender,
    fullName: user?.fullName || user?.fname + ' ' + user?.lname,
    age: user.age,
    userGesCode: user.userGesCode,
    category: user.category,
    cbsCategory: user.cbsCategory,
  };
}

export function getDifferenceBetweenObjects(object: any, base: any) {
  function changes(object: any, base: any) {
    return transform(object, function (result: any, value, key) {
      if (!isEqual(value, base[key])) { result[key] = (isObject(value) && isObject(base[key])) ? changes(value, base[key]) : value; }
    });
  }
  let newVersion = changes(object, base);
  let oldVersion = changes(base, object);

  if (newVersion?.proofTravel) {
    newVersion = { ...newVersion, ...newVersion?.proofTravel }; oldVersion = { ...oldVersion, ...oldVersion?.proofTravel}
    delete newVersion?.proofTravel; delete oldVersion?.proofTravel
  };
  delete newVersion?._id; delete oldVersion?._id;
  return { newVersion, oldVersion };
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


declare type PaginationParam = 'offset' | 'limit';

declare type SortingParam = 'sort' | 'way';

declare type FilterParam = (PaginationParam & SortingParam & 'projection') extends keyof QueryOptions ? PaginationParam | SortingParam | 'projection' : never;

declare type QueryResult = {
  status?: number;
  message?: string;
  data?: unknown;
}
