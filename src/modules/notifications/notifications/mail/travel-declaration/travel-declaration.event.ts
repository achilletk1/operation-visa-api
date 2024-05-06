import { Travel } from "modules/travel";
import moment from "moment";

export class TravelDeclarationEvent implements TravelDeclarationMailData {
    end!: string;
    name!: string;
    start!: string;
    created!: string;
    ceiling!: string;
    receiver!: string;
    civility!: string;

    constructor(travel: Travel) {
        this.civility = travel?.user?.gender === 'F' ? 'Mme' : ((travel?.user?.gender === 'M') ? 'M.' : 'M./Mme');
        this.name = travel?.user?.fullName || '';
        this.receiver = travel?.user?.email || '';
        this.ceiling = String(travel?.ceiling) || '';
        this.created = moment(+Number(travel?.dates?.created)).format('DD/MM/YYYY HH:mm');
        this.start = moment(+Number(travel?.proofTravel?.dates?.start)).startOf('day').format('DD/MM/YYYY');
        this.end = moment(+Number(travel?.proofTravel?.dates?.end)).endOf('day').format('DD/MM/YYYY');
    }
}

interface TravelDeclarationMailData {
    end: string;
    name: string;
    start: string;
    created: string;
    ceiling: string;
    receiver: string;
    civility: string;
}