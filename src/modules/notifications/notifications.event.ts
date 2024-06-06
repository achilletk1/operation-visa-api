import { UploadedDocumentsOnExceededFolderEvent, UploadedDocumentsOnExceededFolderMailNotification } from './notifications/mail/uploaded-documents-on-exceeded-folder';
import { TransactionOutsideNotJustifiedEvent, TransactionOutsideNotJustifiedMailNotification } from './notifications/mail/transaction-outside-not-justified';
import { FirstReminderOfFormalNoticeEvent, FirstReminderOfFormalNoticeMailNotification } from './notifications/mail/first-reminder-of-formal-notice';
import { OnlinePaymentStatusChangedEvent, OnlinePaymentStatusChangedMailNotification } from './notifications/mail/online-payment-status-changed';
import { OnlinePaymentDeclarationEvent, OnlinePaymentDeclarationMailNotification } from './notifications/mail/online-payment-declaration';
import { SecondReminderOfFormalNoticeEvent, SecondReminderOfFormalNoticeMailNotification } from './notifications/mail/second-raise';
import { MonthlyRecapStatementEvent, MonthlyRecapStatementMailNotification } from './notifications/mail/monthly-recap-statement';
import { ListOfUsersToBlockedEvent, ListOfUsersToBlockedMailNotification } from './notifications/mail/list-of-users-to-blocked';
import { DeclarationTemplateSmsEvent, DeclarationTemplateSmsNotification } from './notifications/sms/declaration-template';
import { RejectOnlinePaymentEvent, RejectOnlinePaymentMailNotification } from './notifications/mail/reject-online-payment';
import { TravelStatusChangedEvent, TravelStatusChangedMailNotification } from './notifications/mail/travel-status-changed';
import { IncreaseCeilingBankEvent, IncreaseCeilingBankMailNotification } from './notifications/mail/increase-ceiling-bank';
import { ImportOperationEmailNotification, ImportOperationErrorEvent } from './notifications/mail/import-operation-error';
import { CeilingCaeAssignedEvent, CeilingCaeAssignedMailNotification } from './notifications/mail/ceiling-cae-assigned';
import { ValidationRequiredEvent, ValidationRequiredMailNotification } from './notifications/mail/validation-required';
import { DetectTransactionsEvent, DetectTransactionsMailNotification } from './notifications/mail/detect-transactions';
import { ImportDeclarationEvent, ImportDeclarationMailNotification } from './notifications/mail/import-declaration';
import { TravelDeclarationEvent, TravelDeclarationMailNotification } from './notifications/mail/travel-declaration';
import { IncreaseCeilingSmsEvent, IncreaseCeilingSmsNotification } from './notifications/sms/increase-ceiling';
import { ValidationTokenEvent, ValidationTokenMailNotification } from './notifications/mail/validation-token';
import { IncreaseCeilingEvent, IncreaseCeilingMailNotification } from './notifications/mail/increase-ceiling';
import { CeilingAssignedEvent, CeilingAssignedMailNotification } from './notifications/mail/ceiling-assigned';
import { RejectTemplateSmsEvent, RejectTemplateSmsNotification } from './notifications/sms/reject-template';
import { RejectCeilingEvent, RejectCeilingMailNotification } from './notifications/mail/reject-ceiling';
import { VisaExceedingEvent, VisaExceedingMailNotification } from './notifications/mail/visa-exceeding';
import { ValidCeilingEvent, ValidCeilingMailNotification } from './notifications/mail/valid-ceiling';
import { FormalNoticeEvent, FormalNoticeMailNotification } from './notifications/mail/formal-notice';
import { RejectTravelEvent, RejectTravelMailNotification } from './notifications/mail/reject-travel';
import { RejectImportEvent, RejectImportMailNotification } from './notifications/mail/reject-import';
import { AuthTokenEmailEvent, AuthTokenEmailNotification } from './notifications/mail/auth-token';
import { TemplateSmsEvent, TemplateSmsNotification } from './notifications/sms/template';
import events from 'events';

export const notificationEmmiter = new events.EventEmitter();

notificationEmmiter.on('travel-declaration-mail', async (data: TravelDeclarationEvent) => {
    await (new TravelDeclarationMailNotification(data)).sendNotification();
});

notificationEmmiter.on('import-declaration-mail', async (data: ImportDeclarationEvent) => {
    await (new ImportDeclarationMailNotification(data)).sendNotification();
});

notificationEmmiter.on('first-raise-mail', async (data: FirstReminderOfFormalNoticeEvent) => {
    await (new FirstReminderOfFormalNoticeMailNotification(data)).sendNotification();
});

notificationEmmiter.on('second-raise-mail', async (data: SecondReminderOfFormalNoticeEvent) => {
    await (new SecondReminderOfFormalNoticeMailNotification(data)).sendNotification();
});

notificationEmmiter.on('reject-travel-mail', async (data: RejectTravelEvent) => {
    await (new RejectTravelMailNotification(data)).sendNotification();
});

notificationEmmiter.on('reject-import-mail', async (data: RejectImportEvent) => {
    await (new RejectImportMailNotification(data)).sendNotification();
});

notificationEmmiter.on('reject-online-payment-mail', async (data: RejectOnlinePaymentEvent) => {
    await (new RejectOnlinePaymentMailNotification(data)).sendNotification();
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
    await (new ListOfUsersToBlockedMailNotification(data)).sendNotification();
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


notificationEmmiter.on('import-declaration-sms', async (data: DeclarationTemplateSmsEvent) => {
    await (new DeclarationTemplateSmsNotification(data)).sendNotification();
});

notificationEmmiter.on('reject-template-sms', async (data: RejectTemplateSmsEvent) => {
    await (new RejectTemplateSmsNotification(data)).sendNotification();
});

notificationEmmiter.on('template-sms', async (data: TemplateSmsEvent) => {
    await (new TemplateSmsNotification(data)).sendNotification();
});

notificationEmmiter.on('declaration-template-sms', async (data: DeclarationTemplateSmsEvent) => {
    await (new DeclarationTemplateSmsNotification(data)).sendNotification();
});

notificationEmmiter.on('increase-ceiling-sms', async (data: IncreaseCeilingSmsEvent) => {
    await (new IncreaseCeilingSmsNotification(data)).sendNotification();
});

notificationEmmiter.on('import-operation-error', async (data: ImportOperationErrorEvent) => {
    await (new ImportOperationEmailNotification(data)).sendNotification();
});
