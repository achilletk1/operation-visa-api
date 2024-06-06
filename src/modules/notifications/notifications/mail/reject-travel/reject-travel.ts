import { BaseMailNotification } from "modules/notifications/base";
import { RejectTravelEvent } from "./reject-travel.event";
import { QueuePriority } from "modules/notifications";

export class RejectTravelMailNotification extends BaseMailNotification<RejectTravelEvent> {

    constructor(notificationData: RejectTravelEvent) {
        super('reject-travel', notificationData, QueuePriority.HIGH, undefined, undefined, 'fr', true);

        this.subject = `Rejet justificatifs de preuve de voyage`;
    }
}