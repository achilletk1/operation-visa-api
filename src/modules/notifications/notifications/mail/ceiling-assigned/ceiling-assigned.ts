import { BaseMailNotification } from "modules/notifications/base";
import { CeilingAssignedEvent } from "./ceiling-assigned.event";
import { QueuePriority } from "modules/notifications";

export class CeilingAssignedMailNotification extends BaseMailNotification<CeilingAssignedEvent> {

    constructor(notificationData: CeilingAssignedEvent) {
        super('ceiling-assigned', notificationData, QueuePriority.HIGH);

        this.subject = `Demande d'augmentation de plafond en cours de traitement`;
    }
}