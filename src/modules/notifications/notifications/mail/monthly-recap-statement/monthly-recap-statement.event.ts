import { MailAttachment } from 'modules/notifications/model';
import { SettingsController } from 'modules/settings';
import { config } from "convict-config";
import { logger } from 'winston-config';
import moment from "moment";

export class MonthlyRecapStatementEvent implements MonthlyRecapStatementMailData {

    date!: string;
    receiver!: string;
    greetings!: string;
    attachments: MailAttachment[] = [];

    constructor(public monthlyList: MailAttachment[]) {
        this.greetings = `Bonjour`;
        this.date = moment().subtract('1', 'month').format('MM/YYYY');
        //this.getBankMail()
        this.receiver = config.get('emailBank');
    }

    async generateAttachments(): Promise<void> {
        try {
            this.attachments = (this.monthlyList.length > 0) ? [{
                name: `Recapitulatif des états du mois ${this.date}`, content: this.monthlyList[0].content
                , contentType: this.monthlyList[0].contentType
            }] : [];
        } catch (e: any) { logger.error(`Error during attachment generation of monthly stastement mail notification \n${e.stack}`); }
    }

    async getBankMail() {
        return await SettingsController.settingsService.findOne({ filter: { key: 'bankMail' } });
    }
}

interface MonthlyRecapStatementMailData {
    receiver: string;
    greetings: string;
    attachments: MailAttachment[];
    generateAttachments(): Promise<void>;
}
