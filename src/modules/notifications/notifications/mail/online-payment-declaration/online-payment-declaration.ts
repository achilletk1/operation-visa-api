import { OnlinePaymentDeclarationEvent } from "./online-payment-declaration.event";
import { BaseMailNotification } from "modules/notifications/base";
import { QueuePriority } from "modules/notifications";

export class OnlinePaymentDeclarationMailNotification extends BaseMailNotification<OnlinePaymentDeclarationEvent> {

    constructor(notificationData: OnlinePaymentDeclarationEvent) {
        super('online-payement-declaration', notificationData, QueuePriority.HIGH, undefined, undefined, 'fr', true);

        this.subject = `Déclaration de payement en ligne`;
    }
}