import { isEmpty } from 'lodash';
import moment from "moment";
import XLSX from 'xlsx';


export function formatUserFilters(fields: any) {
    const { start, end, provider, ncp, category, status, walletList } = fields;
    // let { offset, limit } = fields;
    // if (![typeof offset, typeof limit].includes('number')) { offset = undefined, limit = undefined; }

    // delete fields.offset;
    // delete fields.limit;
    delete fields.start;
    delete fields.end;

    if (category && +category === 100499) { fields.category = { '$in': [100, 200] }; }

    if (category && +category === 500699) { fields.category = { '$in': [500, 600, 601, 602, 603, 604,700,701] }; }

    const range = (start && end) ? { start: moment(start).startOf('day').valueOf(), end: moment(end).endOf('day').valueOf() } :
        undefined;
    if (range) fields['dates.createdt'] = { $gte: range?.start, $lte: range?.end };

    if (walletList) {
        // revoir en combinaison de 3 (ncp, status, provider)

        if (provider) { fields[`${provider}.enable`] = (!status) ? { $exists: true } : status.toLowerCase() === 'true'; }
        if (!provider && status && !ncp) { fields.$or = [{ 'walletAirtel.enable': status.toLowerCase() === 'true' }, { 'walletMTN.enable': status.toLowerCase() === 'true' }, { 'walletGIMAC.enable': status.toLowerCase() === 'true' }] }

        if (provider && ncp) { fields[`${provider}.account.ncp`] = ncp; }
        if (!provider && !status && ncp) { fields.$or = [{ 'walletAirtel.account.ncp': ncp }, { 'walletMTN.account.ncp': ncp }, { 'walletGIMAC.account.ncp': ncp }] }
        if (!provider && status && ncp) {
            fields.$and = [{ '$or': [{ 'walletAirtel.enable': status.toLowerCase() === 'true' }, { 'walletMTN.enable': status.toLowerCase() === 'true' }, { 'walletGIMAC.enable': status.toLowerCase() === 'true' }] }, { '$or': [{ 'walletAirtel.account.ncp': ncp }, { 'walletMTN.account.ncp': ncp }, { 'walletGIMAC.account.ncp': ncp }] }];
        }
        if (!provider && !status && !ncp) { fields.$or = [{ 'walletAirtel': { $exists: true } }, { 'walletMTN.': { $exists: true } }, { 'walletGIMAC': { $exists: true } }]; }
        fields.category = 100;
        delete fields.walletList;
        delete fields.provider;
        delete fields.status;
        delete fields.ncp;
    }

    if (fields?.nameFilter) {} // TODO affect aggregation for filterring all previous filter, with match case on  `${doc.lname} ${doc.fname}`.toLowerCase().includes(`${fields?.nameFilter}`.toLowerCase()

    if (isEmpty(fields)) fields = { enabled: true };

    return fields;
};

export function generateUsersExportXlsx(users: any[]) {

    let result = users;

    const categories: any = {
        100: 'CODIR', 200: 'CHEF DE REGION', 300: 'GESTIONNAIRE',
        400: 'CHEF AGENCE', 500: 'AGENT DE BANQUE', 600: 'EXTERNE'
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
                `${categories[user.visaOpecategory] || 'N/A'}`,
                `${moment(user?.created_at).format('DD/MM/YYYY')}`,
                `${enabled[user?.enabled] || 'N/A'}`,
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

