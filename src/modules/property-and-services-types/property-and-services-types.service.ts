import { PropertyAndServicesTypesRepository } from "./property-and-services-types.repository";
import { PropertyAndServicesTypesController } from "./property-and-services-types.controller";
import { PropertyAndServicesType } from "./model";
import { CrudService } from "common/base";
import moment from "moment";

export class PropertyAndServicesTypesService extends CrudService<PropertyAndServicesType> {

    static propertyAndServicesTypesRepository: PropertyAndServicesTypesRepository;

    constructor() {
        PropertyAndServicesTypesService.propertyAndServicesTypesRepository = new PropertyAndServicesTypesRepository();
        super(PropertyAndServicesTypesService.propertyAndServicesTypesRepository);
    }

    async insertPropertyAndServicesTypes(data: PropertyAndServicesType) {
        try {
            data.dates = { created: moment().valueOf() };
            return await PropertyAndServicesTypesController.propertyAndServicesTypesService.create(data);
        } catch (error) { throw error; }
    }

    async updatePropertyAndServicesTypesById(id: string, data: PropertyAndServicesType) {
        try {
            data.dates.updated = moment().valueOf();
            return await PropertyAndServicesTypesController.propertyAndServicesTypesService.update({ _id: id }, data);
        } catch (error) { throw error; }
    }

}