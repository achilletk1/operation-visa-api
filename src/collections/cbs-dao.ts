import { config } from '../config';
import { logger } from '../winston';
import  http from 'request-promise';
import { commonService } from '../services/common.service';
import  moment from 'moment';

const classPath = 'database.cbsDAO';

const cbsApiUrl = `${config.get('cbsApiUrl')}/api/v1`

export const options: any = {
    method: '',
    uri: ``,
    json: true,
    timeout: `${config.get('timeout')}`,
    qs: null
};

export const cbsDAO = {
    getDataColumns: async () => {
        const methodPath = `${classPath}.getDataColumns()`;
        try {

            options.method = 'GET';
            options.uri = `${cbsApiUrl}/clients/variables/system`;

            logger.info(`Attempt to call CBS API; getDataColumns`, methodPath, options);
            logger.debug('options query', options);
            const result = await http(options);
            return result;
        } catch (error) {
            logger.error(`\n getDataColumns failed`, methodPath, error);
            process.exit(1)
            return error;
        }
    },

    getUserDataByCode: async (code: any, includeAccounts?: any, isChaFilter?: boolean) => {
        const methodPath = `${classPath}.getUserDataByCode()`;
        const qs = includeAccounts ? { include_accounts: true } : {};

        try {

            options.method = 'GET';
            options.uri = `${cbsApiUrl}/clients/${code}`;
            options.qs = qs;
            logger.info(`Attempt to call CBS API; getUserDataByCode`, methodPath, options);
            const result = await http(options);

            if ([true, 'true'].includes(isChaFilter)) { result.accounts = result?.accounts.filter(elt => ['371', '372'].includes(elt?.CHA.slice(0, 3))); }

            return result;
        } catch (error) {
            logger.error(`\ngetUserDataByCode failed`, methodPath, error);
            // process.exit(1);
            return error;
        }
    },
}
