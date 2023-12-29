import { TravelDeclarationEvent } from "./travel-declaration.event";
import { BaseMailNotification } from "modules/notifications/base";
import { QueuePriority } from "modules/notifications";

export class TravelDeclarationMailNotification extends BaseMailNotification<TravelDeclarationEvent> {

    constructor(notificationData: TravelDeclarationEvent) {
        super('travel-declaration', notificationData, QueuePriority.HIGH, undefined, undefined, 'fr', true);

        this.key = 'travelDeclaration';
        this.subject = `Déclaration de voyage Hors CEMAC`;
    }
}