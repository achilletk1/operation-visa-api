
import { ImportsRepository } from './imports.repository';
import { CrudService } from "common/base";

export class ImportsService extends CrudService<any> {

    static importsRepository: ImportsRepository;

    constructor() {
        ImportsService.importsRepository = new ImportsRepository();
        super(ImportsService.importsRepository);
    }  

}
