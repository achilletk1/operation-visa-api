import { SecondReminderOfFormalNoticeEvent } from "./second-raise.event";
import { BaseMailNotification } from "modules/notifications/base";
import { QueuePriority } from "modules/notifications";

export class SecondReminderOfFormalNoticeMailNotification extends BaseMailNotification<SecondReminderOfFormalNoticeEvent> {

    constructor(notificationData: SecondReminderOfFormalNoticeEvent) {
        super('visa-template', notificationData, QueuePriority.HIGH, undefined, 'remindTransactionNotJustifiedAfterLongTime', notificationData.lang);

        this.key = 'remindTransactionNotJustifiedAfterLongTime';
        this.subject = ''; // If subject are set in template, it must be erase this subject
    }
}