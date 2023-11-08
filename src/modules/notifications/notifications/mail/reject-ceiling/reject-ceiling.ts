import { RejectCeilingEvent } from "./reject-ceiling.event";
import { BaseMailNotification } from "modules/notifications/base";
import { QueuePriority } from "modules/notifications";

export class RejectCeilingMailNotification extends BaseMailNotification<RejectCeilingEvent> {

    constructor(notificationData: RejectCeilingEvent) {
        super('reject-ceiling', notificationData, QueuePriority.HIGH);

        this.subject = `Rejet demande augmantation de plafond`;
    }
}