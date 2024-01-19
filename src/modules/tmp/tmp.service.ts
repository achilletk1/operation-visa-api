import { getCbsUserVariables } from "common/utils/coreBanking";
import { TmpRepository } from "./tmp.repository";
import { CrudService } from "common/base";
import { TmpData } from "./model";

export class TmpService extends CrudService<TmpData> {

    static tmpRepository: TmpRepository;

    constructor() {
        TmpService.tmpRepository = new TmpRepository();
        super(TmpService.tmpRepository);
    }

    async getLettersVariables() {
        try {
            const variables = getCbsUserVariables();
            variables.push(...['SYSTEM_TODAY_LONG', 'SYSTEM_TODAY_SHORT', 'START']);
            return variables;
        } catch (error) { throw error; }
    }


}
