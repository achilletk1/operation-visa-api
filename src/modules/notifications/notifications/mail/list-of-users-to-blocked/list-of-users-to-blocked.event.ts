import { generatePdfContainBlockedUser } from 'modules/export';
import { MailAttachment } from 'modules/notifications/model';
import { VisaTransaction } from 'modules/visa-transactions';
import { config } from "convict-config";
import { logger } from 'winston-config';
import moment from "moment";

export class ListOfUsersToBlockedEvent implements ListOfUsersToBlockedMailData {
    id = '';
    greetings = `Bonjour`;
    receiver = config.get('emailBank');
    attachments: MailAttachment[] = [];
    date = moment().format('DD/MM/YYYY');

    constructor(public usersList: VisaTransaction[]) { }

    async generateAttachments(): Promise<void> {
        try {
            const content = await generatePdfContainBlockedUser(this.usersList);
            this.attachments = !!content ? [{ name: `client-en-demeure ${this.date}`, content, contentType: 'application/pdf' }] : [];
        } catch (e: any) { logger.error(`Error during attachment generation of list-of-users-to-blocked mail notification \n${e.stack}`); }
    }
}

interface ListOfUsersToBlockedMailData {
    id: string;
    date: string;
    usersList: any[];
    receiver: string;
    greetings: string;
    attachments: MailAttachment[];

    generateAttachments(): Promise<void>;
}