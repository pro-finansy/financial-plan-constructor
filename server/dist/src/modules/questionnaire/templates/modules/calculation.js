"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const periods = [
    { id: 'NOT_PERIOD', period: 0, months: 0 },
    { id: 'MONTHLY', period: 12, months: 1 },
    { id: 'QUARTERLY', period: 4, months: 3 },
    { id: 'SEMIANNUALLY', period: 2, months: 6 },
    { id: 'ANNUALLY', period: 1, months: 12 },
];
const currentTerm = (term) => {
    return (term.duration_id === 'MONTH') ? Number(term.term) / 12 : Number(term.term);
};
const currentPeriod = (id) => {
    return periods.find(p => p.id === id).period;
};
const currentMonths = (id) => {
    return periods.find(p => p.id === id).months;
};
const FV = (income, inflation, term) => {
    return Number(income) * Math.pow(1 + inflation, term);
};
const FV1 = (resourses, profitability, term) => {
    return Number(resourses) * Math.pow(1 + profitability, term);
};
const numberWithSpaces = (x) => {
    x = Number(x);
    return x.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};
const periodChart = [
    { id: 12, list: [
            { id: [0, 0], value: 'Январь' },
            { id: [1, 1], value: 'Февраль' },
            { id: [2, 2], value: 'Март' },
            { id: [3, 3], value: 'Апрель' },
            { id: [4, 4], value: 'Май' },
            { id: [5, 5], value: 'Июнь' },
            { id: [6, 6], value: 'Июль' },
            { id: [7, 7], value: 'Август' },
            { id: [8, 8], value: 'Сентябрь' },
            { id: [9, 9], value: 'Октябрь' },
            { id: [10, 10], value: 'Ноябрь' },
            { id: [11, 11], value: 'Декабрь' },
        ] },
    { id: 4, list: [
            { id: [0, 2], value: 'Первый квартал' },
            { id: [3, 5], value: 'Второй квартал' },
            { id: [6, 8], value: 'Третий квартал' },
            { id: [9, 11], value: 'Четвертый квартал' },
        ] },
    { id: 2, list: [
            { id: [0, 5], value: 'Первое полугодие' },
            { id: [6, 11], value: 'Второе полугодие' },
        ] },
    { id: 1, list: [
            { id: [0, 11], value: '' }
        ] }
];
const dateFilterChart = (date, period) => {
    const cdate = new Date(date);
    const month = cdate.getMonth();
    const cperiod = periodChart.find(p => p.id === period).list;
    const cValue = cperiod.find(p => p.id[0] <= month && p.id[1] >= month);
    return `${cValue.value} ${cdate.getFullYear()} г.`;
};
const chartFill = (resourses, term, period, month, profitability, targetCurrency, targetCurrencySign, getCurrectCurrency, course, currentR) => {
    if (period === 0)
        return [];
    let chart = [];
    let capital = 0;
    const date = new Date();
    date.setDate(date.getDate() + 7);
    if (Number(getCurrectCurrency(resourses, targetCurrency)) > 0) {
        resourses.forEach(resourse => {
            capital += Number(getCurrectCurrency([resourse], targetCurrency));
            chart = [...chart, {
                    date: dateFilterChart(date, period), amount: numberWithSpaces(resourse.data.amount), sign: resourse.data.currency_id, profitability: 0, capital: numberWithSpaces(capital), currency: targetCurrency
                }];
        });
    }
    for (let i = 0; i < term * period; i++) {
        date.setMonth(date.getMonth() + month);
        const lastIndex = chart.length - 1;
        resourses.forEach(resourse => {
            capital += Number(getCurrectCurrency([resourse], targetCurrency));
            const p = chart[lastIndex] ? Number((capital * profitability / period).toFixed(1)) : 0;
            const c = chart[lastIndex] ? Number((capital + p).toFixed(1)) : 0;
            chart = [...chart, { date: dateFilterChart(date, period), amount: numberWithSpaces(currentR), sign: targetCurrency, profitability: p, capital: numberWithSpaces(c), currency: targetCurrency }];
        });
    }
    return chart;
};
exports.default = { currentTerm, currentPeriod, currentMonths, FV, FV1, chartFill };
//# sourceMappingURL=calculation.js.map