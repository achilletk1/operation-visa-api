import { encode, decode } from './helpers/url-crypt/url-crypt.service.helper';
import * as exportsHelper from './helpers/exports.helper';
import * as httpContext from 'express-http-context';

import { commonService } from './common.service';
import { usersService } from './users.service';
import { get, isEmpty } from 'lodash';
import { logger } from '../winston';
import { config } from '../config';
import * as moment from 'moment';
import { notificationsCollection } from '../collections/notifications.collection';


const classPath = 'services.exportsService';

export const exportsService = {



    generateNotificationExportLinks: async (userId: string, query: any) => {
       
        const user = await usersService.getUserById(userId);
        if (!user || isEmpty(user)) { return new Error('UserNotFound'); }
        
        const ttl = moment().add(config.get('exportTTL'), 'seconds').valueOf();

        delete query.action;

        const options = { userId, query , ttl };

        const pdfCode = encode({ format: 'pdf', ...options });

        const xlsxCode = encode({ format: 'xlsx', ...options });

        const basePath = `${config.get('baseUrl')}${config.get('basePath')}/notification-generate/${userId}/export`

        return {
            pdfPath: `${basePath}/${pdfCode}`,
            xlsxPath: `${basePath}/${xlsxCode}`
        }
    },

    generateNotificationExportData: async (id: string, code: any) => {

        let options;

        try {
            options = decode(code);
        } catch (error) { return new Error('BadExportCode'); }

        const { format, query , userId, ttl } = options;

        if ((new Date()).getTime() >= ttl) { return new Error('ExportLinkExpired'); }

        if (id !== userId) { return new Error('Forbbiden'); }

        const user = await usersService.getUserById(userId);

        if (!user) { return new Error('UserNotFound'); }
        commonService.parseNumberFields(query);
        const { offset, limit, start, end } = query;
        delete query.offset;
        delete query.limit;
        delete query.start;
        delete query.end;

        const range = (start && end) ? { start: moment(start, 'DD-MM-YYYY').startOf('day').valueOf(), end: moment(end, 'DD-MM-YYYY').endOf('day').valueOf() } :
            undefined;

        const {data} =  await notificationsCollection.getNotifications(query || {}, offset || 1, limit || 40, range);

        if (!data || isEmpty(data)) {
            logger.info('notification not found', `${classPath}.getNotifications()`);
            return new Error('NotificationNotFound');
        }

        let result: any;

        if (format === 'pdf') {//
            const pdfString = await exportsHelper.generateNotificationExportPdf(user, data, start, end );
            const buffer = Buffer.from(pdfString, 'base64');
            result = { contentType: 'application/pdf', fileContent: buffer };
        }

        if (format === 'xlsx') {
            const excelData = exportsHelper.generateTransactionExportXlsx(data);
            const buffer = Buffer.from(`${excelData}`, 'base64');
            result = { contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', fileContent: buffer };
        }

        return result;
    }

    

};