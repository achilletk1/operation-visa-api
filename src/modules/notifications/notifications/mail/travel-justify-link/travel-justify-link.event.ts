import { getStatusExpression } from "modules/notifications/helper";
import { commonField } from "common/base/base.service";
import { commonFields } from "common/interfaces";
import { Travel } from "modules/travel";
import moment from "moment";



export class TravelJustifyLinkEvent extends commonField implements TravelJustifyLinkData {

    link!: string;
    status!: string;

    constructor(travel: Travel, link: string) {
        super(travel);
        this.status = getStatusExpression(travel?.status);
        this.start = moment(travel?.proofTravel?.dates?.start).format('DD/MM/YYYY') || '';
        this.end = moment(travel?.proofTravel?.dates?.end).format('DD/MM/YYYY') || '';
        this.link = link;
    }
}

interface TravelJustifyLinkData extends commonFields {
    end: string;
    name: string;
    link: string;
    start: string;
    status: string;
    receiver: string;
    civility: string;
}