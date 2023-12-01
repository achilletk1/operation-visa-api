import { VisaExcedingEvent } from "./visa-exceding.event";
import { BaseMailNotification } from "modules/notifications/base";
import { QueuePriority } from "modules/notifications";

export class VisaExcedingMailNotification extends BaseMailNotification<VisaExcedingEvent> {

    constructor(notificationData: VisaExcedingEvent) {
        super('visa-mail', notificationData, QueuePriority.HIGH, undefined, 'ceilingOverrun');

        this.subject = `Dépassement de plafond sur les transactions Hors CEMAC`; // If subjet are setted in template, it must be erase this subject
    }
}