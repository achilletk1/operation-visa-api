import { ValidationRequiredEvent } from "./validation-required.event";
import { BaseMailNotification } from "modules/notifications/base";
import { QueuePriority } from "modules/notifications";

export class ValidationRequiredMailNotification extends BaseMailNotification<ValidationRequiredEvent> {

    constructor(notificationData: ValidationRequiredEvent) {
        super('validation-required', notificationData, QueuePriority.HIGH);

        this.subject = notificationData.subject;
    }
}