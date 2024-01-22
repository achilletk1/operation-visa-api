import { executeQuery } from "common/oracle-daos/config";
import { isDevOrStag } from "common/helpers";
import { CbsBankBranch } from '../model';
import { getMockBanks } from "./helpers";
import { logger } from 'winston-config';

const classPath = 'database.dao.banks';

export const banksDAO = {

    getBankList: async (): Promise<CbsBankBranch[]> => {
        const methodPath = `${classPath}.getBankList()`;

        try {
            logger.info(`init get banks for cbs`, { methodPath });
    
            if (isDevOrStag) { return getMockBanks(); }
    
            const query = `
            select age code_agence, lib nom_agence, '120' as pays, 'CAMEROUN                      ' as lib_pays, '10001     ' as code_banque, 'BICEC                         ' as nom_banque
            from infoc.bkage
            order by nom_agence
            `;
    
            const result = await executeQuery(query);
    
            return result;
        } catch (error: any) {
            logger.error(`Failed to get bank list`, { error, stack: error.stack, methodPath });
            throw error;
        }
    }
};
