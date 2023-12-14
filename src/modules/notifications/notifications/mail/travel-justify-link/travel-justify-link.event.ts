import { getStatusExpression } from "modules/notifications/helper";
import { Travel } from "modules/travel";
import moment from "moment";



export class TravelJustifyLinkEvent implements TravelJustifyLinkData {
    end!: string;
    name!: string;
    link!: string;
    start!: string;
    status!: string;
    receiver!: string;
    civility!: string;

    constructor(travel: any, link: string) {
        this.civility = travel?.user?.gender === 'F' ? 'Mme' : ((travel?.user?.gender === 'M') ? 'M.' : 'M./Mme');
        this.name = travel?.user?.fullName || '';
        this.receiver = travel?.user?.email || '';
        this.status = getStatusExpression(travel?.status);
        this.start = moment(travel?.proofTravel?.dates?.start).format('DD/MM/YYYY') || '';
        this.end = moment(travel?.proofTravel?.dates?.end).format('DD/MM/YYYY') || '';
        this.link = link;
    }
}

interface TravelJustifyLinkData {
    end: string;
    name: string;
    link: string;
    start: string;
    status: string;
    receiver: string;
    civility: string;
}