import { config } from '../config';
import { logger } from '../winston';
import * as http from 'request-promise';
import { commonService } from '../services/common.service';
import * as moment from 'moment';

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
            options.uri = `${cbsApiUrl}/clients/data/columns`;

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
}
