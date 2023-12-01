import { BaseMailNotification } from "modules/notifications/base";
import { AuthTokenEmailEvent } from "./auth-token.event";
import { QueuePriority } from "modules/notifications";

export class AuthTokenEmailNotification extends BaseMailNotification<AuthTokenEmailEvent> {

    constructor(notificationData: AuthTokenEmailEvent) {
        super('auth-token-mail', notificationData, QueuePriority.HIGH);

        this.subject = `Mot de passe temporaire ${this.appName} ${this.company}`;
    }
}