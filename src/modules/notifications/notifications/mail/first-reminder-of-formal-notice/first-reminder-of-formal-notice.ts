import { FirstReminderOfFormalNoticeEvent } from "./first-reminder-of-formal-notice.event";
import { BaseMailNotification } from "modules/notifications/base";
import { QueuePriority } from "modules/notifications";

export class FirstReminderOfFormalNoticeMailNotification extends BaseMailNotification<FirstReminderOfFormalNoticeEvent> {

    constructor(notificationData: FirstReminderOfFormalNoticeEvent) {
        super('visa-template', notificationData, QueuePriority.HIGH, undefined, 'remindTransactionNotJustifiedAfterShortTime', notificationData.lang);

        this.key = 'remindTransactionNotJustifiedAfterShortTime';
        this.subject = ''; // If subject are set in template, it must be erase this subject
    }
}