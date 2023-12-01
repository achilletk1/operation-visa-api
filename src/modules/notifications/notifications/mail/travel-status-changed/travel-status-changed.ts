import { TravelStatusChangedEvent } from "./travel-status-changed.event";
import { BaseMailNotification } from "modules/notifications/base";
import { QueuePriority } from "modules/notifications";

export class TravelStatusChangedMailNotification extends BaseMailNotification<TravelStatusChangedEvent> {

    constructor(notificationData: TravelStatusChangedEvent) {
        super('travel-status-changed', notificationData, QueuePriority.HIGH);

        this.subject = `Mise à jour de la déclaration de voyage hors CEMAC`;
    }
}