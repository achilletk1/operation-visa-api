import { BaseMailNotification } from "modules/notifications/base";
import { VisaExceedingEvent } from "./visa-exceeding.event";
import { QueuePriority } from "modules/notifications";

export class VisaExceedingMailNotification extends BaseMailNotification<VisaExceedingEvent> {

    constructor(notificationData: VisaExceedingEvent) {
        super('visa-template', notificationData, QueuePriority.HIGH, undefined, 'ceilingOverrun', notificationData.lang);

        this.key = 'ceilingOverrun';
        this.subject = ''; // If subject are set in template, it must be erase this subject
    }
}