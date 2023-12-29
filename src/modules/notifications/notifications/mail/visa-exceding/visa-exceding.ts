import { VisaExcedingEvent } from "./visa-exceding.event";
import { BaseMailNotification } from "modules/notifications/base";
import { QueuePriority } from "modules/notifications";

export class VisaExcedingMailNotification extends BaseMailNotification<VisaExcedingEvent> {

    constructor(notificationData: VisaExcedingEvent) {
        super('visa-template', notificationData, QueuePriority.HIGH, undefined, 'ceilingOverrun', notificationData.lang);

        this.key = 'ceilingOverrun';
        this.subject = ''; // If subjet are setted in template, it must be erase this subject
    }
}