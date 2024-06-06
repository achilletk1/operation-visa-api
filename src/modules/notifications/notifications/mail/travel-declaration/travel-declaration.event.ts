import { commonField } from "common/base/base.service";
import { commonFields } from "common/interfaces";
import { Travel } from "modules/travel";
import moment from "moment";

export class TravelDeclarationEvent extends commonField implements TravelDeclarationMailData {

    end!: string;
    name!: string;
    start!: string;
    ceiling!: number;
    created!: string;

    constructor(travel: Travel, public cc: string = '') {
        super(travel);
        this.ceiling = travel?.ceiling || 0;
        this.created = moment(+Number(travel?.dates?.created)).format('DD/MM/YYYY HH:mm');
        this.start = moment(+Number(travel?.proofTravel?.dates?.start)).startOf('day').format('DD/MM/YYYY');
        this.end = moment(+Number(travel?.proofTravel?.dates?.end)).endOf('day').format('DD/MM/YYYY');
    }
}

interface TravelDeclarationMailData extends commonFields {
    cc: string;
    end: string;
    name: string;
    start: string;
    ceiling: number;
    created: string;
}