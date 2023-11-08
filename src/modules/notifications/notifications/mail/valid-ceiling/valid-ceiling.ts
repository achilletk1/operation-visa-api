import { BaseMailNotification } from "modules/notifications/base";
import { ValidCeilingEvent } from "./valid-ceiling.event";
import { QueuePriority } from "modules/notifications";

export class ValidCeilingMailNotification extends BaseMailNotification<ValidCeilingEvent> {

    constructor(notificationData: ValidCeilingEvent) {
        super('valid-ceiling', notificationData, QueuePriority.HIGH);

        this.subject = `Validation demande augmantation de plafond`;
    }
}