import { IncreaseCeilingBankEvent } from "./increase-ceiling-bank.event";
import { BaseMailNotification } from "modules/notifications/base";
import { QueuePriority } from "modules/notifications";

export class IncreaseCeilingBankMailNotification extends BaseMailNotification<IncreaseCeilingBankEvent> {

    constructor(notificationData: IncreaseCeilingBankEvent) {
        super('increase-ceiling-bank', notificationData, QueuePriority.HIGH);

        this.subject = `Nouvelle demande d'augmentation de plafond enregistrée sur le portail BCI MOBILE`;
    }
}