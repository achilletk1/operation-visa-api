import { generateVisaTransactionExportXlsx, generateCeillingExportXlsx, generateOnlineOperationsExportXlsx, generateOnlinePaymentExportXlsx, generateTravelsExportXlsx, generateExpenseDetailsExportXlsx } from "./helper/export.xlsx.helper";
import { getExtensionByContentType, generateNotificationExportPdf, getContentTypeByExtension, generateDeclarationFolderExportPdf } from "./helper/export.pdf.helper";
import { generateOperationZippedFolder, getFileNamesTree } from "./helper/export.zip.helper";
import { FilesController } from 'modules/visa-transactions-files/files';
import { OnlinePaymentController, OnlinePaymentStatement } from "modules/online-payment";
import { NotificationsController } from "modules/notifications";
import { parseNumberFields, timeout } from "common/helpers";
import { ExpenseDetail, TravelController } from 'modules/travel';
import { camelCase, get, isEmpty } from "lodash";
import { UsersController } from "modules/users";
import { BaseService } from "common/base";
import { readFile } from "common/utils";
import { config } from "convict-config";
import crypt from 'url-crypt';
import moment from "moment";

const { cryptObj, decryptObj } = crypt(config.get('exportSalt'));

export class ExportService extends BaseService {


    constructor() { super(); }

    async generateExportVisaTransactionLinks(fields: any) {
        const { end, start, clientCode } = fields;
        timeout(5000);
        const ttl = moment().add(config.get('exportTTL'), 'seconds').valueOf();

        const options = { end, start, ttl, clientCode };

        const code = cryptObj(options);

        const basePath = `${config.get('basePath')}/export/visa-transactions`

        return { link: `${config.get('baseUrl')}${basePath}/${code}` };
    }

    async generateExportVisaTransactionData(code: string) {
        let options: any;

        try {
            options = decryptObj(code);
        } catch (error) { throw Error('BadExportCode'); }

        const { end, start, ttl, clientCode } = options;

        if ((new Date()).getTime() >= ttl) { throw Error('ExportLinkExpired'); }
        const transaction: any[] = []; // TODO get transactions for reporting
        const data = generateVisaTransactionExportXlsx(transaction);
        const buffer = Buffer.from(data, 'base64');

        const fileName = `export_${new Date().getTime()}-transaction_visa`

        return { contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', fileContent: buffer, fileName };
    }

    async generateExportVisaAttachmentView(query: any) {
        try {
            const { path } = query;
            const data = readFile(path);
            return data;
        } catch (error) { throw error; }
    }

    async generateExportAttachmentLinks(fields: any) {
        const { path, contentType } = fields;
        timeout(5000);
        const ttl = moment().add(config.get('exportTTL'), 'seconds').valueOf();

        const options = { ttl, path, contentType };

        const code = cryptObj(options);

        const basePath = `${config.get('basePath')}/export/attachement`

        return { link: `${config.get('baseUrl')}${basePath}/${code}` };
    }

    async generateExportVisaAttachmentData(code: string) {
        let options: any;

        try {
            options = decryptObj(code);
        } catch (error) { throw Error('BadExportCode'); }

        const { ttl, path, contentType, fileName } = options;

        if ((new Date()).getTime() >= ttl) { throw Error('ExportLinkExpired'); }

        const data = readFile(path);
        const buffer = Buffer.from(data, 'base64');
        const extension = getExtensionByContentType(contentType)
        const name = `export_${new Date().getTime()}-${fileName}.${extension}`;

        return { contentType, fileContent: buffer, fileName: name };
    }

    async generateOnlinePaymentExportLinks(fields: any) {
        delete fields.action;
        parseNumberFields(fields);
        delete fields.name;
        delete fields.status;
        delete fields.clientCode;
        delete fields.offset;
        delete fields.limit;
        delete fields.ttl;

        const payments = await OnlinePaymentController.onlinePaymentService.getOnlinePaymentsBy({ ...fields });
        if (isEmpty(payments?.data)) { throw Error('OnlinePaymentNotFound'); }

        const ttl = moment().add(config.get('exportTTL'), 'seconds').valueOf();

        const options = { ttl, ...fields };

        const code = cryptObj(options);

        const basePath = `${config.get('baseUrl')}${config.get('basePath')}/export/online-payment`

        return { link: `${basePath}/${code}` };
    }

    async generateOnlinePaymentExporData(code: string) {
        let options;
        try {
            options = decryptObj(code);
        } catch (error) { throw Error('BadExportCode'); }

        const { ttl } = options;
        delete options.name;
        delete options.status;
        delete options.clientCode;
        delete options.offset;
        delete options.limit;
        delete options.ttl;

        options = { ...options }
        if ((new Date()).getTime() >= ttl) { throw Error('ExportLinkExpired'); }

        const payments = await OnlinePaymentController.onlinePaymentService.getOnlinePaymentsBy(options);

        let data;
        const excelArrayBuffer = await generateOnlinePaymentExportXlsx(payments?.data);
        const buffer = Buffer.from(excelArrayBuffer);

        data = { contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', fileContent: buffer };

        return data;
    }

    async generateOnlinePaymentOperationsExportLinks(operationId: string) {
        const payments = await OnlinePaymentController.onlinePaymentService.findOne({ filter: { _id: operationId } });
        if (isEmpty(payments?.transactions)) { throw Error('MonthOnlineOperationsNotFound'); }

        const ttl = moment().add(config.get('exportTTL'), 'seconds').valueOf();

        const options = { ttl, operationId };

        const code = cryptObj(options);

        const basePath = `${config.get('baseUrl')}${config.get('basePath')}/export/payment-operations-code`

        return { link: `${basePath}/${code}` };
    }

    async generateOnlinePaymenOperationstExporData(code: string) {
        let options;
        try {
            options = decryptObj(code);
        } catch (error) { throw Error('BadExportCode'); }

        const { ttl } = options;

        options = { ...options }
        if ((new Date()).getTime() >= ttl) { throw Error('ExportLinkExpired'); }

        const operations = await OnlinePaymentController.onlinePaymentService.findOne({ filter: { _id: options.operationId } });

        if (isEmpty(operations)) { throw Error('TransactionNotFound'); }

        let data;
        const excelArrayBuffer = await generateOnlineOperationsExportXlsx(operations);
        const buffer = Buffer.from(excelArrayBuffer);

        data = { contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', fileContent: buffer };

        return data;
    }

    async generateTravelsCeillingExportLinks(travelId: string) {
        const travle = await TravelController.travelService.findOne({ filter: { _id: travelId } });
        if (isEmpty(travle?.transactions)) { throw Error('OnlineCeillingNotFound'); }

        const ttl = moment().add(config.get('exportTTL'), 'seconds').valueOf();

        const options = { ttl, travelId };

        const code = cryptObj(options);

        const basePath = `${config.get('baseUrl')}${config.get('basePath')}/export/ceilling-code`

        return { link: `${basePath}/${code}` };
    }

    async generateTravelsCeillingExporData(code: string) {
        let options;
        try {
            options = decryptObj(code);
        } catch (error) { throw Error('BadExportCode'); }

        const { ttl } = options;
        // delete options.travelId
        // delete options.ttl;

        options = { ...options }
        if ((new Date()).getTime() >= ttl) { throw Error('ExportLinkExpired'); }

        const travel: any = await TravelController.travelService.findOne({ filter: { _id: options?.travelId } });

        let data;
        const excelArrayBuffer = await generateCeillingExportXlsx(travel);
        const buffer = Buffer.from(excelArrayBuffer);

        data = { contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', fileContent: buffer };

        return data;
    }

    async generateNotificationExportLinks(userId: string, query: any) {

        const user = await UsersController.usersService.findOne({ filter: { _id: userId } });
        if (!user || isEmpty(user)) { throw Error('UserNotFound'); }

        const ttl = moment().add(config.get('exportTTL'), 'seconds').valueOf();

        delete query.action;

        const options = { userId, query, ttl };

        const pdfCode = cryptObj({ format: 'pdf', ...options });

        const xlsxCode = cryptObj({ format: 'xlsx', ...options });

        const basePath = `${config.get('baseUrl')}${config.get('basePath')}/export/notification-generate/${userId}`

        return {
            pdfPath: `${basePath}/${pdfCode}`,
            xlsxPath: `${basePath}/${xlsxCode}`
        };
    }

    async generateNotificationExportData(id: string, code: string) {
        try {
            let options;

            try {
                options = decryptObj(code);
            } catch (error) { throw Error('BadExportCode'); }

            const { format, query, userId, ttl } = options;

            if ((new Date()).getTime() >= ttl) { throw Error('ExportLinkExpired'); }
            if (id !== userId) { throw Error('Forbbiden'); }

            const user = await UsersController.usersService.findOne({ filter: { _id: userId } });
            if (!user) { throw Error('UserNotFound'); }

            parseNumberFields(query);
            const { offset, limit, start, end } = query;
            delete query.offset;
            delete query.limit;
            delete query.start;
            delete query.end;

            const range = (start && end) ? { start: moment(start, 'DD-MM-YYYY').startOf('day').valueOf(), end: moment(end, 'DD-MM-YYYY').endOf('day').valueOf() } :
                { start: moment().startOf('month').valueOf(), end: moment().endOf('month').valueOf() };
            const { data } = await NotificationsController.notificationsService.findAll({ filter: { ...(query || {}), ...range }, });

            if (!data || isEmpty(data)) {
                this.logger.info(`notification not found, ${this.constructor.name}.getNotifications()`);
                throw Error('NotificationNotFound');
            }
            let result: any;

            if (format === 'pdf') {
                const pdfString = await generateNotificationExportPdf(user, data, start, end);
                const buffer = Buffer.from(pdfString, 'base64');
                result = { contentType: 'application/pdf', fileContent: buffer };
            }

            return result;

        } catch (error) { throw error; }
    }

    async generateTravelsExportLinks(fields: any) {
        delete fields.action;
        parseNumberFields(fields);
        delete fields.ttl;

        const travels = await TravelController.travelService.findAll({ filter: fields });
        if (isEmpty(travels?.data)) { throw Error('travelsNotFound'); }

        const ttl = moment().add(config.get('exportTTL'), 'seconds').valueOf();

        const options = { ttl, ...fields };

        const code = cryptObj(options);

        const basePath = `${config.get('baseUrl')}${config.get('basePath')}/export/travels`

        return {
            link: `${basePath}/${code}`
        }
    }

    async generateTravelsExporData(code: string) {
        let options;
        try {
            options = decryptObj(code);
        } catch (error) { throw Error('BadExportCode'); }

        const { ttl } = options;
        delete options.ttl;

        options = { ...options }
        if ((new Date()).getTime() >= ttl) { throw Error('ExportLinkExpired'); }

        const travels = await TravelController.travelService.findAll({ filter: options });

        let data;
        const excelArrayBuffer = await generateTravelsExportXlsx(travels?.data);
        const buffer = Buffer.from(excelArrayBuffer);

        data = { contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', fileContent: buffer };

        return data;
    }

    async generateVisaTransactionsFilesExportLinks(id: string, data: any) {
        try {
            const { key, label } = data

            const file = await FilesController.filesService.findOne({ filter: { key } });
            if (!file) { throw Error('Forbbiden'); }

            const ttl = moment().add(config.get('exportTTL'), 'seconds').valueOf();

            const options = { key, ttl, label };

            const code = cryptObj({ ...options });

            const basePath = `${config.get('basePath')}/export/visa-transactions-files/${id}`;

            return {
                link: `${config.get('baseUrl')}${basePath}/${code}`
            }
        } catch (error) { throw error; }
    }

    async generateVisaTransactionsFilesExporData(id: string, code: string) {
        try {
            let options;

            try {
                options = decryptObj(code);
            } catch (error) { throw Error('BadExportCode'); }

            const { key, ttl, label } = options;

            if ((new Date()).getTime() >= ttl) { throw Error('ExportLinkExpired'); }

            const datas = await FilesController.filesService.findOne({ filter: { key } });
            const buffer = Buffer.from(datas?.value, 'base64');
            const format = getContentTypeByExtension(label.split('.')[1])
            const fileName = `${label}`;

            return { contentType: `${format}`, fileContent: buffer, fileName };
        } catch (error) { throw error; }
    }

    async generateDeclarationFolderExportLinks(type: string, _id: string) {
        try {
            if (!['travel', 'onlinePayment'].includes(type)) { throw Error('BadExportType'); }

            const data = type === 'travel'
                ? await TravelController.travelService.findOne({ filter: { _id } })
                : type === 'onlinePayment'
                    ? await OnlinePaymentController.onlinePaymentService.findOne({ filter: { _id } }) : null;
            if (!data) { throw Error('DataNotFound'); }

            const ttl = moment().add(config.get('exportTTL'), 'seconds').valueOf();

            const options = { ttl, id: _id, type };

            const code = cryptObj(options);

            const basePath = `${config.get('baseUrl')}${config.get('basePath')}/export/declaration`

            return {
                link: `${basePath}/${code}`
            }
        } catch (error) { throw error; }
    }

    async generateDeclarationFolderExporData(code: string): Promise<any> {
        try {
            let options;

            try {
                options = decryptObj(code);
            } catch (error) { throw Error('BadExportCode'); }

            const { ttl, id } = options;
            const type: 'travel' | 'onlinePayment' = options.type;

            if ((new Date()).getTime() >= ttl) { throw Error('ExportLinkExpired'); }

            const data = type === 'travel'
                ? await TravelController.travelService.findOne({ filter: { _id: id } })
                : type === 'onlinePayment'
                    ? await OnlinePaymentController.onlinePaymentService.findOne({ filter: { _id: id } }) : null;

            if (!data) { throw Error('DataNotFound'); }

            const folder = getFileNamesTree(data, type);

            const declarationRecapPdf: any = await generateDeclarationFolderExportPdf(data, type);

            folder.push({ content: declarationRecapPdf, label: 'Recap_Declaration', type: 'file', contentType: 'application/pdf' });
            const dataTosendToExcel = {
                'travel': {
                    type: 'expenseDetails',
                    expenseDetails: get(data, 'expenseDetails', []) as ExpenseDetail[],
                    name: 'Voyage'
                },
                'onlinePayment': {
                    type: 'onlinePayment',
                    expenseDetails: get(data, 'statements', []) as OnlinePaymentStatement[],
                    name: 'Paiement_en_ligne'
                }
            }
            const excelExpenseDetailsBuffer = await generateExpenseDetailsExportXlsx(dataTosendToExcel[type].expenseDetails, dataTosendToExcel[type].type as 'onlinePayment' | 'expenseDetails' | 'othersAttachements');
            if (excelExpenseDetailsBuffer) {
                const excelExpenseDetailsData = Buffer.from(excelExpenseDetailsBuffer);
                folder.push({ content: excelExpenseDetailsData, label: 'Etat dépenses', type: 'file', contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            }

            if (type === 'travel' && !isEmpty(get(data, 'othersAttachements'))) {
                const excelOthersAttachementsBuffer = await generateExpenseDetailsExportXlsx(get(data, 'othersAttachements', []), 'othersAttachements');
                const excelOthersAttachementsData = Buffer.from(excelOthersAttachementsBuffer);
                folder.push({ content: excelOthersAttachementsData, label: 'Autres Justifs', type: 'file', contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

            }

            const zip = generateOperationZippedFolder(folder as any);

            const fileName = `${dataTosendToExcel[type].name}_${camelCase(data?.user?.fullName)}_${id}.zip`
            return { fileContent: zip, fileName, contentType: 'application/zip, application/octet-stream' };
        } catch (error) { throw error; }
    }

}
