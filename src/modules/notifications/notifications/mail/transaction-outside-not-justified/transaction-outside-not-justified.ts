import { TransactionOutsideNotJustifiedEvent } from "./transaction-outside-not-justified.event";
import { BaseMailNotification } from "modules/notifications/base";
import { QueuePriority } from "modules/notifications";

export class TransactionOutsideNotJustifiedMailNotification extends BaseMailNotification<TransactionOutsideNotJustifiedEvent> {

    constructor(notificationData: TransactionOutsideNotJustifiedEvent) {
        super('visa-template', notificationData, QueuePriority.HIGH, undefined, 'transactionOutsideNotJustified', notificationData.lang);

        this.key = 'transactionOutsideNotJustified';
        this.subject = ''; // If subject are set in template, it must be erase this subject
    }
}