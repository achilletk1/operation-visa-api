import { RejectOnlinePaymentEvent } from "./reject-online-payment.event";
import { BaseMailNotification } from "modules/notifications/base";
import { QueuePriority } from "modules/notifications";

export class RejectOnlinePaymentMailNotification extends BaseMailNotification<RejectOnlinePaymentEvent> {

    constructor(notificationData: RejectOnlinePaymentEvent) {
        super('reject-online-payment', notificationData, QueuePriority.HIGH, undefined, undefined, 'fr', true);
        this.subject = `Rejet justificatifs de paiement en ligne`;
    }
}