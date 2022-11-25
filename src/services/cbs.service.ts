import  http from 'request-promise';
import { config } from '../config';
import { logger } from '../winston';
import { commonService } from './common.service';
import { trim } from 'lodash';
import { cbsDAO } from '../collections/cbs-dao';

const cbsApiUrl = `${config.get('cbsApiUrl')}/api/v1`

const classPath = 'services.cbsService';

export const cbsService = {
    getCbsUserVariables: async () => {

        if (config.get('env') === 'development' || config.get('env') === 'staging') { await commonService.timeout(500); }

        try {
            const data = await await cbsDAO.getDataColumns();
            return data;
        } catch (error) {
            return error;
        }
    },
}