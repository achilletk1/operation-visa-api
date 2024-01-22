import { UploadedDocumentsOnExceededFolderEvent } from "./uploaded-documents-on-exceeded-folder.event";
import { BaseMailNotification } from "modules/notifications/base";
import { QueuePriority } from "modules/notifications";

export class UploadedDocumentsOnExceededFolderMailNotification extends BaseMailNotification<UploadedDocumentsOnExceededFolderEvent> {

    constructor(notificationData: UploadedDocumentsOnExceededFolderEvent) {
        super('uploaded-documents-on-exceeded-folder', notificationData, QueuePriority.HIGH);

        this.subject = `Ajout des pièces justificatives dans un dossier hors délai le ${notificationData.date}`;
    }
}