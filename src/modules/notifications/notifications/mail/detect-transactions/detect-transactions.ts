import { DetectTransactionsEvent } from "./detect-transactions.event";
import { BaseMailNotification } from "modules/notifications/base";
import { QueuePriority } from "modules/notifications";

export class DetectTransactionsMailNotification extends BaseMailNotification<DetectTransactionsEvent> {

    constructor(notificationData: DetectTransactionsEvent) {
        super('visa-template', notificationData, QueuePriority.HIGH, undefined, 'firstTransaction', notificationData.lang);

        this.key = 'firstTransaction';
        this.subject = ''; // If subject are set in template, it must be erase this subject
    }
}