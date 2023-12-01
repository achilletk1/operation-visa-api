import { BaseSmsNotification } from "modules/notifications/base";
import { TokenSmsEvent } from "./token.event";

export class TokenSmsNotification extends BaseSmsNotification<TokenSmsEvent> {

    constructor(notificationData: TokenSmsEvent) {
        super(notificationData.phone, '', '');

        this.body = `Bienvenue sur l'application ${this.appName} de la ${this.company}. Veuillez utiliser le mot de passe temporaire ${notificationData.token} pour valider votre operation.`;
    }
}