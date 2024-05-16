import { Agencies } from 'modules/visa-operations/enum';
import { authorizations } from 'modules/auth/profile';
import { UserCategory } from '../enum/user.enum';
import httpContext from 'express-http-context';
import { isEmpty } from 'lodash';
import { User } from '../model';
import moment from "moment";
import XLSX from 'xlsx';


export function formatUserFilters(fields: any) {

    const { SUPER_ADMIN, ADMIN, SUPPORT } = UserCategory;

    const { start, end, provider, ncp, category, status, walletList } = fields;
    // let { offset, limit } = fields;
    // if (![typeof offset, typeof limit].includes('number')) { offset = undefined, limit = undefined; }

    // delete fields.offset;
    // delete fields.limit;
    delete fields.start;
    delete fields.end;

    (category && +category === 100499) && (fields.category = { '$gte': 100, '$lte': 499 });

    (category && +category === 500699) && (fields.category = { '$gte': 500, '$lte': 699 });

    const range = (start && end) ? { start: moment(start).startOf('day').valueOf(), end: moment(end).endOf('day').valueOf() } :
        undefined;
    (range) && (fields['dates.createdt'] = { $gte: range?.start, $lte: range?.end });

    if (fields?.nameFilter) { } // TODO affect aggregation for filterring all previous filter, with match case on  `${doc.lname} ${doc.fname}`.toLowerCase().includes(`${fields?.nameFilter}`.toLowerCase()

    // match user authorizations datas
    matchUserAuthorizationsDatas(fields);

    (isEmpty(fields)) && (fields = { enabled: true });

    return fields;
};

export function generateUsersExportXlsx(users: User[]) {

    let result = users;

    const categories: any = {
        541: "CHARGE D'ETUDE SCRC", 601: 'CHEF SERVICE SCRC', 540: 'GESTIONNAIRE', 600: 'CHEF AGENCE',
        500: 'CONTROLEUR', 520: 'AUDITEUR', 542: 'GESTIONNAIRE PERSONNEL', 602: 'CHEF AGENCE PERSONNEL',
        603: 'DIRCTEUR REGIONNAL', 604: 'CODIR', 620: 'SUPPORT', 621: 'PARAMETREUR', 650: 'ADMINISTRATEUR',
    };

    const enabled: any = {
        true: 'ACTIF',
        false: 'INACTIF',
    };
    // Format Excel file columns headers;
    if (result) {
        const excelData = [];
        excelData.push(['Identifiant', 'Nom du client', 'Email', 'Téléphone', 'Catégorie', 'date de création', 'Status']);

        result.forEach(async (user) => {
            const elt = [
                `${user?.userCode || 'N/A'}`,
                `${user?.fullName || 'N/A'}`,
                `${user?.email || 'N/A'}`,
                `${user?.tel || 'N/A'}`,
                `${categories[user?.category || 0] || 'N/A'}`,
                `${moment(user?.created_at).format('DD/MM/YYYY')}`,
                `${user?.enabled ? 'ACTIF' : 'INACTIF' || 'N/A'}`,
            ];
            excelData.push(elt);
        });

        const ws = XLSX.utils.json_to_sheet(excelData);
        const wb = XLSX.utils.book_new();

        // Set Excel file columns width;
        ws['!cols'] = [];
        for (const iterator of excelData[0]) {
            ws['!cols'].push({ wch: 23 })
        }
        XLSX.utils.book_append_sheet(wb, ws, `users_${new Date().getTime()}`);
        return XLSX.write(wb, { type: 'base64' });

    }

}

function matchUserAuthorizationsDatas(fields: any): any {
    const authUser = httpContext.get('user');
    const authorizationsUser: string[] = httpContext.get('authorizations') || [];
    const { SUPER_ADMIN, ADMIN, SUPPORT, PERSONNEL_MANAGER, ACCOUNT_MANAGER, AGENCY_HEAD, HEAD_OF_PERSONNEL_AGENCY } = UserCategory;

    if (!authorizationsUser.length || [SUPER_ADMIN, ADMIN, SUPPORT].includes(authUser?.category)) { return; }

    fields['age.code'] = { $nin: [`${Agencies.PERSONNAL}`] };

    (authorizationsUser.includes(
        authorizations.PERSONNEL_MANAGER_DATA_WRITE ||
        authorizations.PERSONNEL_MANAGER_DATA_VIEW ||
        authorizations.HEAD_OF_PERSONNEL_AGENCY_VIEW ||
        authorizations.HEAD_OF_PERSONNEL_AGENCY_WRITE
    )) && (fields['age.code'] = `${Agencies.PERSONNAL}`);

    ([PERSONNEL_MANAGER, ACCOUNT_MANAGER].includes(authUser?.category)) && (fields['userGesCode'] === `${authUser?.gesCode}`);
    ([HEAD_OF_PERSONNEL_AGENCY, AGENCY_HEAD].includes(authUser?.category)) && (fields['age.code'] = `${authUser?.age?.code}`);
}

interface cardType {
    _id?: string;
    label?: string;
    productCode?: string;
    cardTypeTransactions: CardTypeTransactions[];
    profiles?: CardProfile[];
    enabled?: boolean;
    created_at?: number;
}

interface CardTransactionsType {
    _id?: string;
    label?: string;
    enabled?: boolean;
    created_at?: number;
}

interface CardTypeTransactions extends CardTransactionsType {
    amount?: number;
    frequency?: 'week' | 'month';
    maxTransactionsPerDay?: number;
}

interface CardProfile {
    code?: string;
    label: string;
    percentage?: number;
    maxTransactionsPerDay?: number;
}
