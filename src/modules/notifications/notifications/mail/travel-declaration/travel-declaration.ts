import { TravelDeclarationEvent } from "./travel-declaration.event";
import { BaseMailNotification } from "modules/notifications/base";
import { QueuePriority } from "modules/notifications";

export class TravelDeclarationMailNotification extends BaseMailNotification<TravelDeclarationEvent> {

    constructor(notificationData: TravelDeclarationEvent) {
        super('travel-declaration', notificationData, QueuePriority.HIGH);

        this.subject = `Déclaration de voyage Hors CEMAC`;
    }
}