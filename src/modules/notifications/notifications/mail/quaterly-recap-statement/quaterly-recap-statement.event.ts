import { generatePdfContainBlockedUser } from 'modules/export';
import { MailAttachment } from 'modules/notifications/model';
import { SettingsController } from 'modules/settings';
import { config } from "convict-config";
import { logger } from 'winston-config';
import moment from "moment";

export class QuarterlyRecapStatementEvent implements QuaterlyRecapStatementMailData {
    date!: string;
    receiver!: string;
    greetings!: string;
    attachments: MailAttachment[] = [];

     constructor(public monthlyList: MailAttachment[]) {
        this.greetings = `Bonjour`;
        this.date = `[${moment().subtract('1','month').format('MM')}
         - ${moment().subtract('2','month').format('MM')} ${moment().subtract('3','month').format('MM')}] ${moment().format('YYYY')}`;
        //this.getBankMail()
        this.receiver = config.get('emailBank');
    }

    async generateAttachments(): Promise<void> {
        try {
            this.attachments = (this.monthlyList.length > 0) ? [{ name: `Recapitulatif des états des trois derniers mois ${this.date}`, content:this.monthlyList[0].content
            , contentType: this.monthlyList[0].contentType }] : [];
        } catch (error: any) { logger.error(`Error during attachment generation of monthly stastement mail notification \n${error.stack}`); }
    }
    async getBankMail(){
        return await SettingsController.settingsService.findOne({ filter: { key: 'bankMail' } });
    }
}

interface QuaterlyRecapStatementMailData {
    receiver: string;
    greetings: string;
    attachments: MailAttachment[];
    generateAttachments(): Promise<void>;
}