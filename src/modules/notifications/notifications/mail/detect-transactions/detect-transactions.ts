import { DetectTransactionsEvent } from "./detect-transactions.event";
import { BaseMailNotification } from "modules/notifications/base";
import { QueuePriority } from "modules/notifications";

export class DetectTransactionsMailNotification extends BaseMailNotification<DetectTransactionsEvent> {

    constructor(notificationData: DetectTransactionsEvent) {
        super('visa-mail', notificationData, QueuePriority.HIGH, undefined, 'ceilingOverrun');

        this.subject = `Dépassement de plafond sur les transactions Hors CEMAC`; // If subjet are setted in template, it must be erase this subject
    }
}