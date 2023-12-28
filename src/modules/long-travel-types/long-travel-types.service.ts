import { LongTravelTypesRepository } from "./long-travel-types.repository";
import { LongTravelTypesController } from "./long-travel-types.controller";
import { CrudService } from "common/base";
import { LongTravelType } from "./model";
import moment from "moment";

export class LongTravelTypesService extends CrudService<LongTravelType> {

    static longTravelTypesRepository: LongTravelTypesRepository;

    constructor() {
        LongTravelTypesService.longTravelTypesRepository = new LongTravelTypesRepository();
        super(LongTravelTypesService.longTravelTypesRepository);
    }

    async insertLongTravelTypes(data: LongTravelType) {
        try {
            const longTravelType = await LongTravelTypesService.longTravelTypesRepository.findOne({ filter: { label: data?.label } }) as never as LongTravelType;
            if (longTravelType) { throw new Error('DataAlreadyExist') }
            data.dates = { created : moment().valueOf() };
            return await LongTravelTypesController.longTravelTypesService.create(data);
        } catch (error) { throw error; }
    }

}
