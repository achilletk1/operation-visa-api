
import { QuarterlyRecapStatementEvent, QueuePriority } from "modules/notifications";
import { BaseMailNotification } from "modules/notifications/base";

export class QuaterlyRecapStatementMailNotification extends BaseMailNotification<QuarterlyRecapStatementEvent> {

    constructor(notificationData: QuarterlyRecapStatementEvent) {
        super('monthly-recap-statement', notificationData, QueuePriority.HIGH);
        this.subject = `[OPERATION VISA] Recapitulatif des mois`;
    }

    static async init(notificationData: QuarterlyRecapStatementEvent) {
        await notificationData.generateAttachments();
        return new QuaterlyRecapStatementMailNotification(notificationData);
    }
}