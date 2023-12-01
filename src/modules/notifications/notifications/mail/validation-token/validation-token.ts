import { ValidationTokenEvent } from "./validation-token.event";
import { BaseMailNotification } from "modules/notifications/base";
import { QueuePriority } from "modules/notifications";

export class ValidationTokenMailNotification extends BaseMailNotification<ValidationTokenEvent> {

    constructor(notificationData: ValidationTokenEvent) {
        super('validation-token', notificationData, QueuePriority.HIGH);

        this.subject = `Mot de passe temporaire ${this.appName} ${this.company}`;
    }
}