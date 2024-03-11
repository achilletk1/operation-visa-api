import { getStatusExpression } from "modules/notifications";
import { Travel } from "modules/travel";
import moment from "moment";

export class TravelStatusChangedEvent implements TravelStatusChangedMailData {
    end!: string;
    name!: string;
    start!: string;
    status!: string;
    receiver!: string;
    civility!: string;

    constructor(travel: Travel, public reason: string) {
        this.civility = travel?.user?.gender === 'F' ? 'Mme' : ((travel?.user?.gender === 'M') ? 'M.' : 'M./Mme');
        this.name = travel?.user?.fullName || '';
        this.receiver = travel?.user?.email || '';
        this.status = getStatusExpression(travel?.status);
        this.start = moment(travel?.proofTravel?.dates?.start).format('DD/MM/YYYY') || '';
        this.end = moment(travel?.proofTravel?.dates?.end).format('DD/MM/YYYY') || '';
    }
}

interface TravelStatusChangedMailData {
    end: string;
    name: string;
    start: string;
    reason: string;
    status: string;
    receiver: string;
    civility: string;
}