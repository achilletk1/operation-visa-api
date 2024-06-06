import { DeclarationTemplateSmsEvent } from "./declaration-template.event";
import { BaseSmsNotification } from "modules/notifications/base";
import { OnlinePaymentMonth } from "modules/online-payment";
import { Import } from "modules/imports";
import { Travel } from "modules/travel";

export class DeclarationTemplateSmsNotification extends BaseSmsNotification<DeclarationTemplateSmsEvent> {

    created!:string;

    constructor(notificationData: DeclarationTemplateSmsEvent) {
        super(notificationData.phone, '', '');
        
        this.body = 
        `Cher Client, Votre déclaration ${this.getOperationText(notificationData.operation)} à été crée ce ${this.created} avec succées. Nous vous remercions pour votre fidélité.`;
    }

    getOperationText(operation: Travel | Import | OnlinePaymentMonth) {
        let msg: string = '';
        (operation instanceof Travel) && (msg = 'de voyage');
        (operation instanceof Import) && (msg = 'd\'importation');
        (operation instanceof OnlinePaymentMonth) && (msg = 'de paiement en ligne');
        return msg;
    }

}
