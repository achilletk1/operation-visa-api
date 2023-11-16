import { TravelJustifyLinkEvent } from "./travel-justify-link.event";
import { BaseMailNotification } from "modules/notifications/base";
import { QueuePriority } from "modules/notifications";


export class TravelJustifyLinkMailNotification extends BaseMailNotification<TravelJustifyLinkEvent> {

    constructor(notificationData: TravelJustifyLinkEvent) {
        super('travel-justify-link', notificationData, QueuePriority.HIGH);

        this.subject = `Lien de justification de voyage hors zone CEMAC`;
    }
}