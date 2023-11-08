import { getCbsUserVariables } from "common/utils/coreBanking";
import { generateFormalNoticeLetter } from "modules/export";
import { LettersRepository } from "./letters.repository";
import { replaceVariables } from "common/helpers";
import { CrudService } from "common/base";
import { Letter } from "./model";

export class LettersService extends CrudService<Letter> {

    static lettersRepository: LettersRepository;

    constructor() {
        LettersService.lettersRepository = new LettersRepository();
        super(LettersService.lettersRepository);
    }

    async getLettersVariables() {
        try {
            const variables = await getCbsUserVariables() as any[];
            variables.push(...['SYSTEM_TODAY_LONG', 'SYSTEM_TODAY_SHORT', 'START']);
            return variables;
        } catch (error) { throw error; }
    }

    async generateExportView(letter: Letter) {
        try {

            if (!letter) { return new Error('LetterNotFound') }
            const pdfDataEn = replaceVariables(letter?.pdf?.en, {}, false,true);
            const pdfDataFr = replaceVariables(letter?.pdf?.fr, {},false, true);

            const pdfStringEn = await generateFormalNoticeLetter({ ...pdfDataEn, signature: letter?.pdf?.signature });

            if (pdfStringEn instanceof Error) { return pdfStringEn; }

            const pdfStringFr = await generateFormalNoticeLetter({ ...pdfDataFr, signature: letter?.pdf?.signature });

            if (pdfStringFr instanceof Error) { return pdfStringFr; }

            return { en: pdfStringEn, fr: pdfStringFr };
        } catch (error) { throw error; }

    }

}
