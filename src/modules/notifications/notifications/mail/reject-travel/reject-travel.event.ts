import { commonFields } from "common/interfaces";
import { commonField } from "common/base";
import { Travel } from "modules/travel";
import moment from "moment";

export class RejectTravelEvent extends commonField implements RejectTravelMailData {

    end!: string;
    start!: string;
    ceiling!: number;
    created!: string;
    rejectReason!: string;

    constructor(travel: Travel, public cc: string = '') {
        super(travel);
        this.ceiling = travel?.ceiling || 0;
        this.created = moment(travel?.dates?.created).format('DD/MM/YYYY HH:mm');
        this.start = moment(travel?.proofTravel?.dates?.start).startOf('day').format('DD/MM/YYYY');
        this.end = moment(travel?.proofTravel?.dates?.end).endOf('day').format('DD/MM/YYYY');
        this.rejectReason = travel.proofTravel?.rejectReason || '';
    }
}

interface RejectTravelMailData extends commonFields {
    cc: string;
    end: string;
    start: string;
    ceiling: number;
    created: string;
    rejectReason: string;
}