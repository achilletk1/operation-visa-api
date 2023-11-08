import moment from "moment";

export const generateChartByType = (data: any) => {
    const mapped = data.map((elt: any)  => {
        return {
            ...elt,
            dayOfWeek: moment(elt.date).day(),
            dayOfMonth: moment(elt.date).month(),
            monthOfYear: moment(elt.date).year()
        }
    });

    // Calculate week chart
    const week = generateChartWeekData(mapped);

    // Calculate month chart
    const month = generateChartMonthData(mapped);

    // Calculate year chart
    const year = generateChartYearData(mapped);

    return { week, month, year };
};

const generateChartWeekData = (figures: any) => {
    const arrLun = figures.filter((elt: any)  => elt.dayOfWeek === 1);
    const Lun = avg(arrLun, 'total');

    const arrMar = figures.filter((elt: any)  => elt.dayOfWeek === 2);
    const Mar = avg(arrMar, 'total');

    const arrMer = figures.filter((elt: any)  => elt.dayOfWeek === 3);
    const Mer = avg(arrMer, 'total');

    const arrJeu = figures.filter((elt: any)  => elt.dayOfWeek === 4);
    const Jeu = avg(arrJeu, 'total');

    const arrVen = figures.filter((elt: any)  => elt.dayOfWeek === 5);
    const Ven = avg(arrVen, 'total');

    const arrSam = figures.filter((elt: any)  => elt.dayOfWeek === 6);
    const Sam = avg(arrSam, 'total');

    const arrDim = figures.filter((elt: any)  => elt.dayOfWeek === 0);
    const Dim = avg(arrDim, 'total');

    return {
        labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
        data: [Lun, Mar, Mer, Jeu, Ven, Sam, Dim]
    };
}

const generateChartMonthData = (figures: any) => {
    const labels = [];
    const data = [];

    for (let index = 1; index <= 31; index++) {
        const arr = figures.filter((elt: any) => elt.dayOfMonth === index);
        const total = avg(arr, 'total')
        labels.push(`${index}`);
        data.push(total);
    }

    return { labels, data };
}

const generateChartYearData = (figures: any) => {
    const arrJan = figures.filter((elt: any)  => elt.monthOfYear === 0);
    const Jan = avg(arrJan, 'total');

    const arrFev = figures.filter((elt: any)  => elt.monthOfYear === 1);
    const Fev = avg(arrFev, 'total');

    const arrMar = figures.filter((elt: any)  => elt.monthOfYear === 2);
    const Mar = avg(arrMar, 'total');

    const arrAvr = figures.filter((elt: any)  => elt.monthOfYear === 3);
    const Avr = avg(arrAvr, 'total');

    const arrMai = figures.filter((elt: any)  => elt.monthOfYear === 4);
    const Mai = avg(arrMai, 'total');

    const arrJun = figures.filter((elt: any)  => elt.monthOfYear === 5);
    const Jun = avg(arrJun, 'total');

    const arrJul = figures.filter((elt: any)  => elt.monthOfYear === 6);
    const Jul = avg(arrJul, 'total');

    const arrAou = figures.filter((elt: any)  => elt.monthOfYear === 7);
    const Aou = avg(arrAou, 'total');

    const arrSep = figures.filter((elt: any)  => elt.monthOfYear === 8);
    const Sep = avg(arrSep, 'total');

    const arrOct = figures.filter((elt: any)  => elt.monthOfYear === 9);
    const Oct = avg(arrOct, 'total');

    const arrNov = figures.filter((elt: any)  => elt.monthOfYear === 10);
    const Nov = avg(arrNov, 'total');

    const arrDec = figures.filter((elt: any)  => elt.monthOfYear === 11);
    const Dec = avg(arrDec, 'total');

    return {
        labels: ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec'],
        data: [Jan, Fev, Mar, Avr, Mai, Jun, Jul, Aou, Sep, Oct, Nov, Dec]
    };
}

const sum = (arr: any, key: any) => {
    let result = 0;
    arr.forEach((elt: any) => result += elt[key]);
    return result;
}

const avg = (arr: any, key: any) => {
    const result = (sum(arr, key) / arr.length) / 1000000 || 0;
    return Math.ceil(result);
}

