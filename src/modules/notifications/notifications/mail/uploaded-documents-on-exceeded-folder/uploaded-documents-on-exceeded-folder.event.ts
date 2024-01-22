import { config } from "convict-config";
import moment from "moment";

export class UploadedDocumentsOnExceededFolderEvent implements UploadedDocumentsOnExceededFolder {
    reference = '';
    date!: string;
    receiver!: string;
    greetings!: string;
    userFullName!: string;
    partialTxt!: string | void;

    constructor(public data: any, public directoryType: string, step: string | undefined, line?: number) {
        this.greetings = `Bonjour`;
        this.date = moment().format('DD/MM/YYYY');
        this.receiver = config.get('emailBank');
        this.partialTxt = this.partialMailTxt(step, line);
        this.reference = data?.ref || 'N/A';
        this.userFullName = data?.fullName || 'N/A';
    }

    private partialMailTxt(step: string | undefined, line?: number): string | void {
        let txt = '';
        if (!step) return;
        switch (step) {
            case 'proofTravel':
                txt = 'Preuve de voyage';
                break;
            case 'expenseDetails':
                txt = 'sur l\'etat  des dépenses voir la dépense N* (' + line + 1 + ')';
                break;
            case 'expenseDetailAndProofTravel':
                txt = 'sur la preuve de voyage et l\'etat des dépenses  voir la dépense N*  (' + line + 1 + ')';
                break;
            case 'onlinePayment':
                txt = 'sur un mois de payement en ligne voir la dépense N*  (' + line + 1 + ')';
                break;
        }
        return txt;
    }

}

interface UploadedDocumentsOnExceededFolder {
    date: string;
    receiver: string;
    reference: string;
    greetings: string;
    userFullName: string;
    directoryType: string;
    partialTxt: string | void;
}
