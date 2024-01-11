import { Travel } from "modules/index";
import moment from "moment";

export class TravelOutOfDateEvent implements TravelOutOfDateData {
    receiver!: string;
    greetings!: string;
    travelRef!: string;
    userName!: string;
    travelType!: string;
    departureDate!: any;
    ArrivetedDate!: any;

    constructor(travel: Partial<Travel>, bankMail: string) {
        this.greetings = 'Bonjour ';
        this.receiver = bankMail;
        this.travelRef = travel.travelRef || '';
        this.userName = travel.user?.fullName || '';
        this.travelType = (travel.travelType === 100) ? 'Courte durée' : 'Longue durée';
        this.departureDate = moment(travel.proofTravel?.dates?.start).format('DD-MM-YYYY');
        this.ArrivetedDate = moment(travel.proofTravel?.dates?.end).format('DD-MM-YYYY')
    }
}

interface TravelOutOfDateData {
    greetings: string;
    receiver: string;
    travelRef: string;
    travelType: string;

}