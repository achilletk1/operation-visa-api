import { BaseSmsNotification } from "modules/notifications/base";
import { FormalNoticeSmsEvent } from "./formal-notice.event";

export class FormalNoticeSmsNotification extends BaseSmsNotification<FormalNoticeSmsEvent> {

    constructor(notificationData: FormalNoticeSmsEvent) {
        super(notificationData.phone, '', 'letters');
        this.key = "letters";
    }
}