import { CeilingCaeAssignedEvent } from "./ceiling-cae-assigned.event";
import { BaseMailNotification } from "modules/notifications/base";
import { QueuePriority } from "modules/notifications";

export class CeilingCaeAssignedMailNotification extends BaseMailNotification<CeilingCaeAssignedEvent> {

    constructor(notificationData: CeilingCaeAssignedEvent) {
        super('ceiling-cae-assigned', notificationData, QueuePriority.HIGH);

        this.subject = `Traitement de la demande d'augmentation de plafond`;
    }
}