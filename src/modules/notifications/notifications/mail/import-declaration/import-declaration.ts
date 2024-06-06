import { ImportDeclarationEvent } from "./import-declaration.event";
import { BaseMailNotification } from "modules/notifications/base";
import { QueuePriority } from "modules/notifications";

export class ImportDeclarationMailNotification extends BaseMailNotification<ImportDeclarationEvent> {

    constructor(notificationData: ImportDeclarationEvent) {
        super('import-declaration', notificationData, QueuePriority.HIGH, undefined, undefined, 'fr', true);
        this.subject = `Déclaration d'importation'`;
    }
}