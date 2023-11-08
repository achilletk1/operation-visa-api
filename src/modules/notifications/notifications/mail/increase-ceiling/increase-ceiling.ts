import { IncreaseCeilingEvent } from "./increase-ceiling.event";
import { BaseMailNotification } from "modules/notifications/base";
import { QueuePriority } from "modules/notifications";
import moment from "moment";

export class IncreaseCeilingMailNotification extends BaseMailNotification<IncreaseCeilingEvent> {

    constructor(notificationData: IncreaseCeilingEvent) {
        super('increase-ceiling', notificationData, QueuePriority.HIGH);

        this.subject = `Demande d'augmentation de plafond du ${moment().format('DD/MM/YYYY')}`;
    }
}