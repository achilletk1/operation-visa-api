import { BaseMailNotification } from "modules/notifications/base";
import { FormalNoticeEvent } from "./formal-notice.event";
import { QueuePriority } from "modules/notifications";

export class FormalNoticeMailNotification extends BaseMailNotification<FormalNoticeEvent> {

    constructor(notificationData: FormalNoticeEvent) {
        super('formal-notice-letter', notificationData, QueuePriority.HIGH, undefined, 'letters', notificationData.lang);

        this.key = 'letters';
        this.subject = (notificationData.lang === 'fr') ? 'Lettre de mise en demeure' : 'Formal notice letter';
    }
}