import { SensitivesNotificationsRepository } from "./sensitives-notifications.repository";
import { TemplateForm } from "modules/templates";
import { CrudService } from "common/base";
export class SensitivesNotificationsService extends CrudService<TemplateForm> {

    static sensitivesNotificationsRepository: SensitivesNotificationsRepository;

    constructor() {
        SensitivesNotificationsService.sensitivesNotificationsRepository = new SensitivesNotificationsRepository();
        super(SensitivesNotificationsService.sensitivesNotificationsRepository);
    }

}