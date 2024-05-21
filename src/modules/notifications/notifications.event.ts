import { UploadedDocumentsOnExceededFolderEvent, UploadedDocumentsOnExceededFolderMailNotification } from './notifications/mail/uploaded-documents-on-exceeded-folder';
import { TransactionOutsideNotJustifiedEvent, TransactionOutsideNotJustifiedMailNotification } from './notifications/mail/transaction-outside-not-justified';
import { OnlinePaymentStatusChangedEvent, OnlinePaymentStatusChangedMailNotification } from './notifications/mail/online-payment-status-changed';
import { OnlinePaymentDeclarationEvent, OnlinePaymentDeclarationMailNotification } from './notifications/mail/online-payement-declaration';
import { MonthlyRecapStatementEvent, MonthlyRecapStatementMailNotification } from './notifications/mail/monthly-recap-statement';
import { ListOfUsersToBlockedEvent, ListOfUsersToBloquedMailNotification } from './notifications/mail/list-of-users-to-bloqued';
import { TravelStatusChangedEvent, TravelStatusChangedMailNotification } from './notifications/mail/travel-status-changed';
import { IncreaseCeilingBankEvent, IncreaseCeilingBankMailNotification } from './notifications/mail/increase-ceiling-bank';
import { CeilingCaeAssignedEvent, CeilingCaeAssignedMailNotification } from './notifications/mail/ceiling-cae-assigned';
import { ValidationRequiredEvent, ValidationRequiredMailNotification } from './notifications/mail/validation-required';
import { DetectTransactionsEvent, DetectTransactionsMailNotification } from './notifications/mail/detect-transactions';
import { TravelDeclarationEvent, TravelDeclarationMailNotification } from './notifications/mail/travel-declaration';
import { ValidationTokenEvent, ValidationTokenMailNotification } from './notifications/mail/validation-token';
import { IncreaseCeilingEvent, IncreaseCeilingMailNotification } from './notifications/mail/increase-ceiling';
import { CeilingAssignedEvent, CeilingAssignedMailNotification } from './notifications/mail/ceiling-assigned';
import { RejectCeilingEvent, RejectCeilingMailNotification } from './notifications/mail/reject-ceiling';
import { VisaExceedingEvent, VisaExceedingMailNotification } from './notifications/mail/visa-exceding';
import { ValidCeilingEvent, ValidCeilingMailNotification } from './notifications/mail/valid-ceiling';
import { FormalNoticeEvent, FormalNoticeMailNotification } from './notifications/mail/formal-notice';
import { AuthTokenEmailEvent, AuthTokenEmailNotification } from './notifications/mail/auth-token';
import { TemplateSmsEvent, TemplateSmsNotification } from './notifications/sms/template';
import { TokenSmsEvent, TokenSmsNotification } from './notifications/sms/token';
import events from 'events';
import { ImportOperationEmailNotification, ImportOperationErrorEvent } from './notifications/mail/import-operation-error';

export const notificationEmmiter = new events.EventEmitter();

notificationEmmiter.on('travel-declaration-mail', async (data: TravelDeclarationEvent) => {
    await (new TravelDeclarationMailNotification(data)).sendNotification();
});

notificationEmmiter.on('online-payment-declaration-mail', async (data: OnlinePaymentDeclarationEvent) => {
    await (new OnlinePaymentDeclarationMailNotification(data)).sendNotification();
});

notificationEmmiter.on('valid-ceiling-mail', async (data: ValidCeilingEvent) => {
    await (new ValidCeilingMailNotification(data)).sendNotification();
});

notificationEmmiter.on('reject-ceiling-mail', async (data: RejectCeilingEvent) => {
    await (new RejectCeilingMailNotification(data)).sendNotification();
});

notificationEmmiter.on('increase-ceiling-bank-mail', async (data: IncreaseCeilingBankEvent) => {
    // TODO add attachment (PDF) on notification (old method : generatePdfContentCeilingRequest)
    await (new IncreaseCeilingBankMailNotification(data)).sendNotification();
});

notificationEmmiter.on('increase-ceiling-mail', async (data: IncreaseCeilingEvent) => {
    // TODO add attachment (PDF) on notification (old method : generatePdfContentCeilingRequest)
    await (new IncreaseCeilingMailNotification(data)).sendNotification();
});

notificationEmmiter.on('ceiling-assigned-mail', async (data: CeilingAssignedEvent) => {
    await (new CeilingAssignedMailNotification(data)).sendNotification();
});

notificationEmmiter.on('ceiling-cae-assigned-mail', async (data: CeilingCaeAssignedEvent) => {
    await (new CeilingCaeAssignedMailNotification(data)).sendNotification();
});

notificationEmmiter.on('online-payment-status-changed-mail', async (data: OnlinePaymentStatusChangedEvent) => {
    await (new OnlinePaymentStatusChangedMailNotification(data)).sendNotification();
});

notificationEmmiter.on('travel-status-changed-mail', async (data: TravelStatusChangedEvent) => {
    await (new TravelStatusChangedMailNotification(data)).sendNotification();
});

notificationEmmiter.on('validation-required-mail', async (data: ValidationRequiredEvent) => {
    await (new ValidationRequiredMailNotification(data)).sendNotification();
});

notificationEmmiter.on('validation-token-mail', async (data: ValidationTokenEvent) => {
    await (new ValidationTokenMailNotification(data)).sendNotification();
});

notificationEmmiter.on('detect-transactions-mail', async (data: DetectTransactionsEvent) => {
    await (new DetectTransactionsMailNotification(data)).sendNotification();
});

notificationEmmiter.on('visa-exceding-mail', async (data: VisaExceedingEvent) => {
    await (new VisaExceedingMailNotification(data)).sendNotification();
});

notificationEmmiter.on('formal-notice-mail', async (data: FormalNoticeEvent) => {
    await (new FormalNoticeMailNotification(data)).sendNotification();
});

notificationEmmiter.on('visa-template-mail', async (data: TransactionOutsideNotJustifiedEvent) => {
    await (new TransactionOutsideNotJustifiedMailNotification(data)).sendNotification();
});

notificationEmmiter.on('list-of-users-to-blocked-mail', async (data: ListOfUsersToBlockedEvent) => {
    await data.generateAttachments();
    await (new ListOfUsersToBloquedMailNotification(data)).sendNotification();
});

notificationEmmiter.on('auth-token-email', async (data: AuthTokenEmailEvent) => {
    await (new AuthTokenEmailNotification(data)).sendNotification();
});

notificationEmmiter.on('uploaded-documents-on-exceeded-folder-mail', async (data: UploadedDocumentsOnExceededFolderEvent) => {
    await (new UploadedDocumentsOnExceededFolderMailNotification(data)).sendNotification();
});

notificationEmmiter.on('monthly-statement-recap-mail', async (data: MonthlyRecapStatementEvent) => {
    await data.generateAttachments();
    await (new MonthlyRecapStatementMailNotification(data)).sendNotification();
});

notificationEmmiter.on('quarterly-statement-recap-mail', async (data: MonthlyRecapStatementEvent) => {
    await data.generateAttachments();
    await (new MonthlyRecapStatementMailNotification(data)).sendNotification();
});


notificationEmmiter.on('token-sms', async (data: TokenSmsEvent) => {
    await (new TokenSmsNotification(data)).sendNotification();
});

notificationEmmiter.on('template-sms', async (data: TemplateSmsEvent) => {
    await (new TemplateSmsNotification(data)).sendTempalteNotification();
});

notificationEmmiter.on('import-operation-error', async (data: ImportOperationErrorEvent) => {
    await (new ImportOperationEmailNotification(data)).sendNotification();
});
