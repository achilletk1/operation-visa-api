import { getCbsUserVariables } from "common/utils/coreBanking";
import { generateFormalNoticeLetter } from "modules/export";
import { replaceVariables } from "common/helpers";
import { CrudService } from "common/base";
import { Letter } from "./model";
import { TmpRepository } from "./tmp.repository";

export class TmpService extends CrudService<Letter> {

    static tmpRepository: TmpRepository;

    constructor() {
        TmpService.tmpRepository = new TmpRepository();
        super(TmpService.tmpRepository);
    }

    async getLettersVariables() {
        try {
            const variables = await getCbsUserVariables() as any[];
            variables.push(...['SYSTEM_TODAY_LONG', 'SYSTEM_TODAY_SHORT', 'START']);
            return variables;
        } catch (error) { throw error; }
    }


}
