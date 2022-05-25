import store from '@/store';
import { dynamicsObject, valueof } from '@/interfaces';
import { COURSES_ENUM, DURATION_ENUM, PERIODS_ENUM } from '@/utils/enums';

const periods = [
  { id: 'NOT_PERIOD', period: 0, months: 0 },
  { id: 'MONTHLY', period: 12, months: 1 },
  { id: 'QUARTERLY', period: 4, months: 3 },
  { id: 'SEMIANNUALLY', period: 2, months: 6 },
  { id: 'ANNUALLY', period: 1, months: 12 },
];

const currectSignCurrency = (currency: string) => {
  const cc = store.getters.currencyList.find((c: dynamicsObject) => c._id === currency);
  return cc ? cc.sign : '!';
}

const numberSpaces = (number: number | string) => {
  return Number(number).toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

const getCurrency = (instrument: dynamicsObject, currency: string, course: valueof<COURSES_ENUM>) => {
  const rates = store.getters.currencies;
  const lot = (course === COURSES_ENUM.TWO && instrument.lot) ? instrument.lot : 1;
  return ((instrument.price * lot * instrument.number_papers / rates[instrument[`currency_${course}_id`]]) * rates[currency]);
};

const currency = (amount: number, currency: string, target_currency: string) => {
  const rates = store.getters.currencies; 
  return Math.ceil10((amount / rates[currency]) * rates[target_currency], -2);
};

const getCurrencyTwo = (instrument: dynamicsObject, currency: string, course: valueof<COURSES_ENUM>) => {
  const rates = store.getters.currencies;
  const lot = (course === COURSES_ENUM.TWO && instrument.lot) ? instrument.lot : 1;
  return ((instrument.price * lot / rates[instrument[`currency_${course}_id`]]) * rates[currency]);
};

const getCorrectCurrency = (datas: Array<dynamicsObject>, currency: string) => {
  const rates = store.getters.currencies;
  return datas.reduce((acc, data) => acc + (data.data.amount / rates[data.data.currency_id] * rates[currency]), 0).toFixed(1);
};

const getCorrectInstrumentsCurrency = (datas: Array<dynamicsObject>, currency: string, course: valueof<COURSES_ENUM>) => {
  const rates = store.getters.currencies;
  return numberSpaces(datas.reduce((acc, data) => acc + (data.price * ((course === COURSES_ENUM.TWO && data.lot) ? data.lot : 1) * data.number_papers / rates[data[`currency_${course}_id`]] * rates[currency]), 0));
};

const getCorrectPercentExpertBalance = (currency: string, course: valueof<COURSES_ENUM>, totalTarget: number, ...arr: Array<dynamicsObject>) => {
  const rates = store.getters.currencies;
  const result: dynamicsObject = {};
  arr.forEach((array, index) => {
    result[index] = array.reduce((acc: number, data: dynamicsObject) => {
      let current = 0;
      if (!data.percent) {
        current = (data.price * ((course === COURSES_ENUM.TWO && data.lot) ? data.lot : 1) * data.number_papers / rates[data[`currency_${course}_id`]] * rates[currency]);
        current = (current / totalTarget) * 100;
      } else {
        current = data.percent;
      }
      return acc + Number(current)
    }, 0);
  });
  let total = 0;
  for (const key in result) {
    total += result[key];
  }
  for (const key in result) {
    result[key] = Number(result[key].toFixed(1));
    if (result[key] || result[key] === 0) result[key] += '%';
  }
  return result;
};

const getCorrectPercentBalance = (currency: string, course: valueof<COURSES_ENUM>, assets: Array<dynamicsObject>, ...arr: Array<Array<dynamicsObject>>) => {
  const rates = store.getters.currencies;
  const result: dynamicsObject = {};
  arr.forEach((array, index) => {
    if (!result[index]) result[index] = 0;
    for (const data of array) {
      const amount = (data.price * ((course === COURSES_ENUM.TWO && data.lot) ? data.lot : 1) * data.number_papers / rates[data[`currency_${course}_id`]] * rates[currency]);
      if (data[`instrument_type_${course}`] === "Фонды смешанных активов" && arr.length === 3) {
        const asset = assets.find((asset) => asset.name.toLowerCase().trim() === data.name.toLowerCase().trim());
        if (asset) {
          const classes = [
            { id: "stock" },
            { id: "bond" },
            { id: "alternative" },
          ];
          classes.forEach((aclass, aindex) => {
            if (!result[aindex]) result[aindex] = 0;
            result[aindex] += amount * (asset[aclass.id] / 100);
          });
        }
      } else {
        result[index] += amount;
      }
    }
  });
  let total = 0;
  for (const key in result) {
    total += result[key];
  }
  for (const key in result) {
    result[key] = Number(((result[key] / total) * 100).toFixed(1));
    if (result[key] || result[key] === 0) result[key] += '%';
  }
  return result;
};

const getCorrectPercentCurrencies = (currency: string, array: Array<dynamicsObject>, course = 'one') => {
  const rates = store.getters.currencies;
  const result: dynamicsObject = {};
  array.forEach(data => {
    if (!result[data[`base_currency_${course}`]]) result[data[`base_currency_${course}`]] = 0;
    const lot = (course === COURSES_ENUM.TWO && data.lot) ? data.lot : 1;
    result[data[`base_currency_${course}`]] += (((data.price * data.number_papers * lot) / rates[data[`currency_${course}_id`]]) * rates[currency]);
  });
  let total = 0;
  for (const key in result) {
    total += result[key];
  };
  for (const key in result) {
    result[key] = Number(((result[key] / total) * 100).toFixed(1));
    if (isNaN(result[key])) result[key] = 0;
    if (result[key] || result[key] === 0) result[key] += '%';
  }
  return result;
};

const currentTerm = (term: dynamicsObject) => {
  return (term.duration_id === DURATION_ENUM.MONTH) ? Number(term.term) / 12 : Number(term.term)
};

const currentPeriod = (id: keyof typeof PERIODS_ENUM) => {
  return periods.find(p => p.id === id)?.period;
};

const currentMonths = (id: keyof typeof PERIODS_ENUM) => {
  return periods.find(p => p.id === id)?.months;
};

const FV = (income: number, inflation: number, term: number) => {
  return (income * Math.pow(1 + inflation, term)).toFixed(1);
};

const FV1 = (resourses: number, profitability: number, term: number) => {
  return resourses * Math.pow(1 + profitability, term);
};

export { currectSignCurrency, currency, FV, currentTerm, getCorrectPercentExpertBalance, getCorrectCurrency, getCorrectInstrumentsCurrency, numberSpaces, getCorrectPercentBalance, getCorrectPercentCurrencies, getCurrency, getCurrencyTwo };
export default { currentTerm, currentPeriod, currentMonths, FV, FV1, getCorrectCurrency, getCorrectInstrumentsCurrency, numberSpaces, currectSignCurrency };