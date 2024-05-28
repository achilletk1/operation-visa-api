import { IncreaseCeilingSmsEvent} from "./increase-ceiling.event";
import { BaseSmsNotification } from "modules/notifications/base";

export class IncreaseCeilingSmsNotification extends BaseSmsNotification<IncreaseCeilingSmsEvent> {

    constructor(notificationData: IncreaseCeilingSmsEvent) {
        super(notificationData.phone, '', '');
        
        this.body = 
        `Cher Client, Votre demande de relèvement de plafond a été enregistrée avec succées. Nous vous informerons du statut de votre demande une fois le traitement terminé.`;
    }
}