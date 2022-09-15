import { commonService } from './common.service';
import moment = require("moment");
import { config } from "../config";
import { decode, encode } from "./helpers/url-crypt/url-crypt.service.helper";
import * as helper from "./helpers/exports.helper";

export const exportService = {


    generateExportVisaTransactionLinks: async (fields: any) => {

        const { end, start, clientCode } = fields;
        commonService.timeout(5000);
        const ttl = moment().add(config.get('exportTTL'), 'seconds').valueOf();

        const options = { end, start, ttl, clientCode };

        const code = encode(options);

        const basePath = `${config.get('basePath')}/export/visa-transactions`

        return {
            link: `${config.get('baseUrl')}${basePath}/${code}`
        }
    },

    generateExportVisaTransactionData: async (code: string) => {
        let options: any;

        try {
            options = decode(code);
        } catch (error) {
            return new Error('BadExportCode');
        }

        const { end, start, ttl, clientCode } = options;

        if ((new Date()).getTime() >= ttl) {
            return new Error('ExportLinkExpired');
        }
        const transaction = helper.visaTransaction;
        const data = helper.generateVisaTransactionExportXlsx(transaction);
        const buffer = Buffer.from(data, 'base64');

        const fileName = `export_${new Date().getTime()}-transaction_visa`

        return { contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', fileContent: buffer, fileName };

    },
}
