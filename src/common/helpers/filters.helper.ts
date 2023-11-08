import { config } from "convict-config";
import moment from "moment";

export const formatFilters = (filter: any) => {
    const { start, end } = filter;
    if (start && moment(start, 'YYYY-MM-DD').isValid()) {
        filter.start = moment(start).startOf('day').valueOf();
    }

    if (end && moment(end, 'YYYY-MM-DD').isValid()) {
        filter.end = moment(end).endOf('day').valueOf();
    }
    filter.ttl = moment().add(config.get('exportTTL'), 'seconds').valueOf();
    return {...filter}
}
