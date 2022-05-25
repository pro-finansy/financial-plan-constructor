import { dynamicsObject } from '@/interfaces';
import { Instrument } from '@/interfaces/dto/instrument';

const periods = [
  { id: 'NOT_PERIOD', period: 0, months: 0 },
  { id: 'MONTHLY', period: 12, months: 1 },
  { id: 'QUARTERLY', period: 4, months: 3 },
  { id: 'SEMIANNUALLY', period: 2, months: 6 },
  { id: 'ANNUALLY', period: 1, months: 12 },
];

const periodChart = [
  {
    id: 12, list: [
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
    ]
  },
  {
    id: 4, list: [
      { id: [0, 2], value: 'Первый квартал' },
      { id: [3, 5], value: 'Второй квартал' },
      { id: [6, 8], value: 'Третий квартал' },
      { id: [9, 11], value: 'Четвертый квартал' },
    ]
  },
  {
    id: 2, list: [
      { id: [0, 5], value: 'Первое полугодие' },
      { id: [6, 11], value: 'Второе полугодие' },
    ]
  },
  {
    id: 1, list: [
      { id: [0, 11], value: '' }
    ]
  }
];

const dateFilterChart = (date: Date | string | number, period: number) => {
  if (period === 0) return;
  const cdate = new Date(date);
  const month = cdate.getMonth();
  const cperiod = periodChart.find(p => p.id === period)?.list;
  if (!cperiod) return ``;
  const cValue = cperiod.find(p => p.id[0] <= month && p.id[1] >= month);
  if (!cValue) return ``;
  return `${cValue.value} ${cdate.getFullYear()} г.`;
};

const currentTerm = (term: dynamicsObject) => {
  return (term.duration_id === 'MONTH') ? Number(term.term) / 12 : Number(term.term)
};

const currentPeriod = (id: string) => {
  return periods.find(p => p.id === id)?.period || 0;
};

const currentMonths = (id: string) => {
  return periods.find(p => p.id === id)?.months || 0;
};

const FV = (income: number, inflation: number, term: number) => {
  return income * Math.pow(1 + inflation, term);
};

const FV1 = (resourses: number, profitability: number, term: number) => {
  return resourses * Math.pow(1 + profitability, term);
};

const chartFill = (resourses: Array<Instrument.Module>, term: number, period: number, month: number, R: number, profitability: number, target: dynamicsObject, targetCurrency: string, targetCurrencySign: string, getCurrectCurrency: (datas: Instrument.Module[], currency: string) => number) => {
  if (period === 0) return [];
  let chart = [] as Array<dynamicsObject>;
  let capital = 0;
  const date = new Date();
  date.setDate(date.getDate() + 7);
  if (Number(getCurrectCurrency(resourses, targetCurrency)) > 0) {
    resourses.forEach(resourse => {
      capital += Number(getCurrectCurrency([resourse], targetCurrency));
      chart = [...chart, {
        date: dateFilterChart(date, period), amount: resourse.data.amount, sign: resourse.data.currency_sign, profitability: 0, capital: capital, currency: targetCurrency
      }]
    });
  }

  for (let i = 0; i < term * period; i++) {
    date.setMonth(date.getMonth() + month);
    const lastIndex = chart.length - 1;

    resourses.forEach(resourse => {
      capital += Number(getCurrectCurrency([resourse], targetCurrency));
      const p = chart[lastIndex] ? Number((capital * profitability / period).toFixed(1)) : 0;
      const c = chart[lastIndex] ? Number((capital + p).toFixed(1)) : 0;
      chart = [...chart, { date: dateFilterChart(date, period), amount: R, sign: targetCurrencySign, profitability: p, capital: c, currency: targetCurrency }];
    });
  }
  return chart;
};

export default { currentTerm, currentPeriod, currentMonths, FV, FV1, chartFill };