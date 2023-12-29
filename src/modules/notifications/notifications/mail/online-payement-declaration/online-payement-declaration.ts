import { OnlinePayementDeclarationEvent } from "./online-payement-declaration.event";
import { BaseMailNotification } from "modules/notifications/base";
import { QueuePriority } from "modules/notifications";

export class OnlinePayementDeclarationMailNotification extends BaseMailNotification<OnlinePayementDeclarationEvent> {

    constructor(notificationData: OnlinePayementDeclarationEvent) {
        super('online-payement-declaration', notificationData, QueuePriority.HIGH, undefined, undefined, 'fr', true);

        this.key = 'onlinePaymentDeclaration';
        this.subject = `Déclaration de payement en ligne`;
    }
}