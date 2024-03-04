import {  MonthlyRecapStatementEvent } from "./monthly-recap-statement.event";
import { BaseMailNotification } from "modules/notifications/base";
import { QueuePriority } from "modules/notifications";

export class MonthlyRecapStatementMailNotification extends BaseMailNotification<MonthlyRecapStatementEvent> {

    constructor(notificationData: MonthlyRecapStatementEvent) {
        super('monthly-recap-statement', notificationData, QueuePriority.HIGH);
        this.subject = `[OPERATION VISA] Recapitulatif du mois`;
    }

    static async init(notificationData: MonthlyRecapStatementEvent) {
        await notificationData.generateAttachments();
        return new MonthlyRecapStatementMailNotification(notificationData);
    }
}