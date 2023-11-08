import moment from "moment";

export function formatUserFilters(fields: any) {
    const { start, end, provider, ncp, category, status, walletList } = fields;
    let { offset, limit } = fields;
    if (![typeof offset, typeof limit].includes('number')) { offset = undefined, limit = undefined; }

    delete fields.offset;
    delete fields.limit;
    delete fields.start;
    delete fields.end;

    if (category && category === 100499) { fields.category = { '$in': [100, 201] }; }

    const range = (start && end) ? { start: moment(start).startOf('day').valueOf(), end: moment(end).endOf('day').valueOf() } :
        undefined;

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

    return fields;
};
