import { BaseMailNotification } from "modules/notifications/base";
import { RejectImportEvent } from "./reject-import.event";
import { QueuePriority } from "modules/notifications";

export class RejectImportMailNotification extends BaseMailNotification<RejectImportEvent> {

    constructor(notificationData: RejectImportEvent) {
        super('reject-import', notificationData, QueuePriority.HIGH, undefined, undefined, 'fr', true);

        this.subject = `Rejet justificatifs d'importation`;
    }
}