import { NotificationsController } from "modules/notifications/notifications.controller";
import { NotificationsType, QueuePriority } from "modules/notifications";
import { generateNotification } from '../helper';
import { saveAttachment } from "common/utils";
import { NotificationFormat } from '../enum';
import { BaseRepository } from "common/base";
import { QueueData } from "common/types";
import { Notification } from '../model';
import { logger } from "winston-config";
import { isEmpty } from "lodash";

export class QueueService extends BaseRepository {

    logger;

    constructor() { super(); this.collectionName = 'queue'; this.logger = logger; }

    async add(type: NotificationsType, queueData: QueueData, priority: QueuePriority = 1, delayUntil?: number | Date) {
        return await this.create({
            type,
            proc: delayUntil ? this.delay(delayUntil) : new Date(),
            priority: priority,
            data: queueData
        } as unknown as globalThis.Document);
    }

    private delay(delayUntil?: Date | number) {
        if (delayUntil instanceof Date) return delayUntil;

        if (typeof delayUntil == 'number') return new Date(+ new Date() + delayUntil * 1000);
    }

    async insertNotification(object: string, format: NotificationFormat, message: string, receiver: string | undefined, id?: string, attachments?: any, key?: any, type?: string) {
        const notification: Notification = generateNotification(object, format, message, receiver, id, attachments, key);
        try {
            const { data } = await NotificationsController.notificationsService.create(notification);
            if (!isEmpty(attachments)) await this.saveAttachments(attachments, notification, data, type || '')
        } catch (error) { throw error; }
    }

    private async saveAttachments(attachments: any[], notification: Notification, notificationId: string, type: string) {
        const attachmentOpts = { content: attachments[0]?.content, contentType: attachments[0]?.contentType, label: attachments[0]?.name };
        try {
            const attachment = saveAttachment(notificationId, attachmentOpts, notification?.dates?.createdAt, type);
            attachment.fileName = attachment.name;
            await NotificationsController.notificationsService.update({ _id: notificationId }, { attachments: [attachment] });
        } catch (error) { throw error; }
    }
}
