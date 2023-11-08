import { VariablesRepository } from "./variables.repository";
import { CrudService } from "common/base";

export class VariablesService extends CrudService<any> {

    static variablesRepository: VariablesRepository;

    constructor() {
        VariablesService.variablesRepository = new VariablesRepository();
        super(VariablesService.variablesRepository);
    }

}