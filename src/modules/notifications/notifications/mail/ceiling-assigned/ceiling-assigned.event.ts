import { Assignered, RequestCeilingIncrease } from "modules/request-ceiling-increase";
import moment from "moment";

export class CeilingAssignedEvent implements CeilingAssignedMailData {
    tel!: string;
    date!: string;
    hour!: string;
    email!: string;
    receiver!: string;
    greetings!: string;
    assignered!: string;

    constructor(ceiling: RequestCeilingIncrease, userAssigned: Assignered) {
        const { fname, lname, tel, email } = userAssigned;
        this.tel = `${tel}`;
        this.email = `${email}`;
        this.assignered = `${fname} ${lname}`;
        this.receiver = ceiling?.user?.email || '';
        this.greetings = this.getGreetings(ceiling);
        this.hour = moment(ceiling?.dates?.assigned).format('HH:mm');
        this.date = moment(ceiling?.dates?.assigned).format('DD/MM/YYYY');
    }

    getGreetings(ceiling: RequestCeilingIncrease) {
        const userFullName = ceiling?.user?.fullName || '';
        const gender = ceiling?.user?.gender === 'm' ? 'M.' : ((ceiling?.user?.gender === 'f') ? 'Mme' : 'M./Mme');
        return `Bonjour ${gender} ${userFullName},`;
    }

}

export interface CeilingAssignedMailData {
    tel: string;
    date: string;
    hour: string;
    email: string;
    receiver: string;
    greetings: string;
    assignered: string;
}

