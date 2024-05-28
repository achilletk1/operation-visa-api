import { BaseSmsNotification } from "modules/notifications/base";
import { RejectTemplateSmsEvent } from "./reject-template.event";

export class RejectTemplateSmsNotification extends BaseSmsNotification<RejectTemplateSmsEvent> {

    constructor(notificationData: RejectTemplateSmsEvent) {
        super(notificationData.phone, '', '');
        this.body =
            `Cher Client, ${this.getOperationText(notificationData.operationName)}, veuillez vous rapprocher de votre agence pour plus d'information. Nous vous remercions pour votre fidélité.`;
    }
    getOperationText(operationName: 'Travel' | 'Import' | 'OnlinePaymentMonth' | 'RequestCeilingIncrease') {
        if (operationName === 'Travel') return 'Vos justificatifs de voyage ont été rejetés';
        if (operationName === 'Import') return 'Vos justificatifs d\'importation ont été rejetés';
        if (operationName === 'OnlinePaymentMonth') return 'Vos justificatifs de paiement en ligne ont été rejetés';
        if (operationName === 'RequestCeilingIncrease') return 'Votre demande de relèvement de plafond a été rejetée';
        return "";
    }
}