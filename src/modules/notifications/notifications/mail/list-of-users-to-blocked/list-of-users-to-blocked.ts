import { ListOfUsersToBlockedEvent } from "./list-of-users-to-blocked.event";
import { BaseMailNotification } from "modules/notifications/base";
import { QueuePriority } from "modules/notifications";

export class ListOfUsersToBlockedMailNotification extends BaseMailNotification<ListOfUsersToBlockedEvent> {

    constructor(notificationData: ListOfUsersToBlockedEvent) {
        super('list-of-users-to-bloqued', notificationData, QueuePriority.HIGH, undefined, undefined, 'fr', true);
        
        this.key = 'customer_in_demeure';
        this.type = 'mails_liste_clients_en_demeurres';
        this.subject = `[OPERATION VISA] Liste des clients en situation de blocage de carte`;
    }

    static async init(notificationData: ListOfUsersToBlockedEvent) {
        await notificationData.generateAttachments();
        return new ListOfUsersToBlockedMailNotification(notificationData);
    }
}