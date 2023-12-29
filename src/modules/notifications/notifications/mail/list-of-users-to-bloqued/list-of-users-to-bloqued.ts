import { ListOfUsersToBloquedEvent } from "./list-of-users-to-bloqued.event";
import { BaseMailNotification } from "modules/notifications/base";
import { QueuePriority } from "modules/notifications";

export class ListOfUsersToBloquedMailNotification extends BaseMailNotification<ListOfUsersToBloquedEvent> {

    constructor(notificationData: ListOfUsersToBloquedEvent) {
        super('list-of-users-to-bloqued', notificationData, QueuePriority.HIGH, undefined, undefined, 'fr', true);
        
        this.key = 'customer_in_demeure';
        this.type = 'mails_liste_clients_en_demeurres';
        this.subject = `[OPERATION VISA] Liste des clients en situation de blocage de carte`;
    }

    static async init(notificationData: ListOfUsersToBloquedEvent) {
        await notificationData.generateAttachments();
        return new ListOfUsersToBloquedMailNotification(notificationData);
    }
}