import { OnlinePaymentStatusChangedEvent } from "./online-payment-status-changed.event";
import { BaseMailNotification } from "modules/notifications/base";
import { QueuePriority } from "modules/notifications";

export class OnlinePaymentStatusChangedMailNotification extends BaseMailNotification<OnlinePaymentStatusChangedEvent> {

    constructor(notificationData: OnlinePaymentStatusChangedEvent) {
        super('online-payment-status-changed', notificationData, QueuePriority.HIGH);

        this.subject = `Mise à jour de la déclaration de payement en ligne`;
    }
}