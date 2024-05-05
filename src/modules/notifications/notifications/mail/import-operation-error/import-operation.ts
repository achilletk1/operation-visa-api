import { ImportOperationErrorEvent } from "./import-operation-error.event";
import { BaseMailNotification } from "modules/notifications/base";
import { QueuePriority } from "modules/notifications";

export class ImportOperationEmailNotification extends BaseMailNotification<ImportOperationErrorEvent> {

    constructor(notificationData: ImportOperationErrorEvent) {
        super('import-operation-error', notificationData, QueuePriority.HIGH);

        this.subject = `Erreur survenue lors de l'importation des Opérations sur ${this.appName}`;
    }
}