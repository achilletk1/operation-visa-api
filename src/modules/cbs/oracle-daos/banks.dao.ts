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
            select
                distinct pays, lib_pays, code_banque, nom_banque, code_agence, (select b.nom from bank.bkbqe b where b.etab = a.code_banque and b.guib = a.code_agence and rownum = 1) nom_agence
            from
                (
                    select
                        a.pays, a.etap code_banque, a.guip code_agence, (select lib1 from bank.bknom where ctab = '033' and cacc = a.pays ) lib_pays,
                        (select lib1 from bank.bknom where ctab = '840' and age = '99500' and cacc = a.etap) nom_banque
                    from bank.bkbqe a
                    where comp = 'O' and etap not in ('20001','91001','92001','96001')
                ) a
            where trim(nom_banque) is not null and trim(lib_pays) is not null and substr(pays,1,3) || substr(code_banque,1,1) not in ('1781','1782','1784','1785','1786')
            order by pays, code_banque
            `;
    
            const result = await executeQuery(query);
    
            return result;
        } catch (error: any) {
            logger.error(`Failed to get bank list`, { error, stack: error.stack, methodPath });
            throw error;
        }
    }
};
