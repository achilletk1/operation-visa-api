import { FilesRepository } from "./files.repository";
import { CrudService } from "common/base";

export class FilesService extends CrudService<any> {

    static filesRepository: FilesRepository;

    constructor() {
        FilesService.filesRepository = new FilesRepository();
        super(FilesService.filesRepository);
    }

}