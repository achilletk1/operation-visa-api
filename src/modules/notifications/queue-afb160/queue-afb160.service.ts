import { NotificationsController } from "../notifications.controller";
import { QueueAfb160Repository } from "./queue-afb160.repository";
import { CrudService } from "common/base";

export class QueueAfb160Service extends CrudService<any> {

    static queueAfb160Repository: QueueAfb160Repository;

    constructor() {
        QueueAfb160Service.queueAfb160Repository = new QueueAfb160Repository();
        super(QueueAfb160Service.queueAfb160Repository);
    }

    async addTransInAfb160Queue(data: any) {
        return await NotificationsController.queueAfb160Service.create(data);
    }

}