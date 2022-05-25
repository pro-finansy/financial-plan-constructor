import { getCurrentExchangeRates, parseLinks, getConvert } from './common';
import { COURSES } from '../../../../utils/enums';
import { dynamicsObject, valueof } from '@/interfaces/index';
import { Questionnaire } from '../../dto/questionnaire.dto';

function getCorrectCurrency(instruments: Array<dynamicsObject>, currency: string, course: valueof<typeof COURSES>) {
  const rates = getCurrentExchangeRates();
  instruments = instruments.filter(i => i.name);
  return instruments.reduce((acc, instrument) => acc + (instrument.number_papers * ((course === 'two' && instrument.lot) ? instrument.lot : 1) * instrument.price / rates[instrument[`currency_${course}_id`]] * rates[currency]), 0).toFixed(0);
};

function getOtherCurrency(amount: number, currency: string, baseCurrency: string) {
  const rates = getCurrentExchangeRates();
  return (amount / rates[currency] * rates[baseCurrency]).toFixed(0);
}

function getUSDCurrency(amount: number, currency: string) {
  const rates = getCurrentExchangeRates();
  return (amount / rates[currency]).toFixed(0);
}

function getRUBCurrency(amount: number, currency: string) {
  const rates = getCurrentExchangeRates();
  return (amount / rates[currency] * rates['RUB']).toFixed(0);
}

function getCurrentInstruments(instruments: Array<dynamicsObject>, type: string, filter: string, filterElements: Array<string>, course: valueof<typeof COURSES>) {
  if (filter && filterElements) {
    if (type.includes('section_') || type.includes('instrument_type_')) return instruments.filter(i => i[`class_${course}_id`] === 'stock' && i['section_' + course] && filterElements.includes(i[filter]));
  } else {
    if (type === 'matdate') return instruments.filter((i) => i[`class_${course}_id`] === "bond");
    if (type.includes('section_')) return instruments.filter(i => i[`class_${course}_id`] === 'stock' && i['section_' + course]);
    if (type.includes('instrument_type_')) return instruments.filter(i => i[`class_${course}_id`] === 'bond' && i['instrument_type_' + course]);
  }
  return instruments;
}

function getCorrectStructurePercents(pid: string, need: boolean, course: valueof<typeof COURSES>, assets: Array<dynamicsObject>, instruments: Array<dynamicsObject>, type: string, filter?: string, filterElements?: Array<string>) {
  const result: dynamicsObject = {};
  const copy = getCurrentInstruments(instruments, type, filter, filterElements, course);
  copy.forEach(instrument => {
    const correct_type = instrument[type] ? instrument[type].trim() : instrument[type];
    if (!result[correct_type] && type !== 'matdate') result[correct_type] = 0;
    if (pid === 'expert' && need) {
      result[correct_type] += Number(instrument.percent);
    } else {
      let lot = (course === COURSES.TWO && instrument.lot) ? instrument.lot : 1;
      const amount = instrument.price * instrument.number_papers * lot;

      const currentAmount = course === COURSES.ONE ?
        Number(getUSDCurrency(amount, instrument[`currency_${course}_id`])) :
        Number(getRUBCurrency(amount, instrument[`currency_${course}_id`]));

      if ((type.includes('class_') || type.includes('section_')) && instrument[`instrument_type_${course}`] === 'Фонды смешанных активов') {
        const mixedAsset = assets.find(asset => asset.name.toLowerCase().trim() === instrument.name.toLowerCase().trim());
        if (mixedAsset) {
          const classes = [
            { one: 'Акция', two: 'Рисковая часть', id: 'stock' },
            { one: 'Облигация', two: 'Консервативная часть', id: 'bond' },
            { one: 'Альтернативные инвестиции', two: 'Защитная часть', id: 'alternative' },
          ];
          if (type.includes('section_')) {
            result[correct_type] += currentAmount * (mixedAsset.stock / 100);
          }
          if (type.includes('class_') ) {
            classes.forEach(classAsset => {
              if (!result[classAsset[course]]) result[classAsset[course]] = 0;
              result[classAsset[course]] += currentAmount * (mixedAsset[classAsset.id] / 100);
            });
          }
        }
      } else if (type === 'matdate') {
        const date = new Date(instrument.matdate);
        if (+date) {
          const correctDate = new Date();
          correctDate.setDate(correctDate.getDate() + 1460);
          if (correctDate <= date) {
            if (!result['Долгосрочные']) result['Долгосрочные'] = 0;
            result['Долгосрочные'] += currentAmount;
          } else {
            if (!result['Краткосрочные']) result['Краткосрочные'] = 0;
            result['Краткосрочные'] += currentAmount;
          }
        }
      } else {
        result[correct_type] += currentAmount;
      }
    }
    
  });
  if (Object.values(result).length > 0 && pid === 'expert' && need) {
    for (const key in result) {
      result[key] = Number(result[key].toFixed(1));
    }
  }
  if (Object.values(result).length > 0 && !(pid === 'expert' && need)) {
    const total = Object.values(result).reduce((t, n) => t + n);
    for (const key in result) {
      if (Object.hasOwnProperty.call(result, key)) {
        result[key] = ((result[key] / total) * 100).toFixed(1);
      }
    }
  }
  if (result && result['Акции'] && type === filter && type === `instrument_type_${course}`) {
    Object.defineProperty(result, 'Акции отдельных компаний',
      Object.getOwnPropertyDescriptor(result, 'Акции'));
    delete result['Акции'];
  }
  return result;
}

function sortInstrumentsSection(instruments: Array<dynamicsObject>) {
  return instruments.sort((a, b) => {
    if (a.section_two > b.section_two) return 1;
    if (a.section_two < b.section_two) return -1;
    return 0;
  });
}

function sortInstruments(type: string, instruments: Array<dynamicsObject>) {
  if (type === 'stock') {
    return [
      ...sortInstrumentsSection(instruments.filter(i => i.instrument_type_two === 'Акции')),
      ...sortInstrumentsSection(instruments.filter(i => i.instrument_type_two !== 'Акции')),
    ];
  }
  if (type === 'bond') {
    const sorting = ['Вклады', 'Валютные счета', 'Деньги', 'Надёжные облигации', 'Облигации', 'ВДО', 'ETF и БПИФ на облигации'];
    let array: Array<dynamicsObject> = [];
    for (const sort of sorting) {
      for (const instrument of instruments) {
        if (instrument.instrument_type_two === sort) array = [...array, instrument];
      }
    }
    for (const instrument of instruments) {
      if (!array.find(e => e.name === instrument.name)) array = [...array, instrument];
    }
    return array;
  }
  return instruments;
}

function filterInstruments(array: Array<dynamicsObject>, course: valueof<typeof COURSES>, type: string) {
  if (course === 'two') {
    return sortInstruments(type, array.filter(e => e[`class_${course}_id`] === type));
  }
  return array.filter(e => e[`class_${course}_id`] === type);
}

function getPortfolioName(key: string, course: valueof<typeof COURSES>) {
  return [
    { id: 'existing', one: 'Анализ существующего портфеля', two: 'Стартовый портфель' },
    { id: 'student', one: 'Портфель ученика на всю сумму цели', two: 'Портфель на сумму цели' },
    { id: 'expert', one: 'Портфель, предлагаемый экспертом', two: 'Портфель от эксперта' },
  ].find(r => r.id === key)[course];
}

function getProtfolioDescription(key: string, course: valueof<typeof COURSES>) {
  return [
    { id: 'existing', one: '', two: 'Стартовый портфель — это портфель, который вы составили для первоначальных инвестиций. Сумма этого портфеля = сумма первых вложений, которые вы планируете осуществить.' },
    { id: 'student', one: '', two: 'Портфель на сумму цели — это портфель, который вы составили для общей (итоговой) суммы вашей цели. Сумма этого портфеля = итоговая сумма вашей финансовой цели.' },
    { id: 'expert', one: '', two: 'Портфель эксперта — это то, как может выглядеть инвестиционный портфель на финальную сумму цели с учётом корректировкок и предложений эксперта. Сумма этого портфеля = итоговая сумма вашей финансовой цели. Вы можете использовать этот портфель, как ориентир или один из вариантов, но не как инвестиционную рекомендацию.' },
  ].find(r => r.id === key)[course];
}

export default (target: Questionnaire.QTarget, course: valueof<typeof COURSES>, assets: Array<dynamicsObject>, FV: number) => {
  getConvert();
  let portfolios: Array<dynamicsObject> = [];
  let index = 0;
  const portfoliosKey = Object.typedKeys(target.portfolios);
  for (const key of portfoliosKey) {
    const portfolio = target.portfolios[key];
    const coreInstruments = portfolio.sections[1].modules.map(m => m.data).filter(i => i.name && i.price);
    const tacticInstruments = key !== 'expert' ? portfolio.sections[2].modules.map(m => m.data).filter(i => i.name && i.price) : [];
    coreInstruments.forEach(i => i.comment = getCorrectInstrumentComment(i.comment, i.commentInstrument));
    tacticInstruments.forEach(i => i.comment = getCorrectInstrumentComment(i.comment, i.commentInstrument));
    portfolios = [...portfolios, {
      id: key,
      name: getPortfolioName(key, course),
      description: getProtfolioDescription(key, course),
      ct_percents: {
        'Ядро': portfolio.sections[0].modules[0].data.core,
        'Тактическая часть': portfolio.sections[0].modules[0].data.tactic
      },
      mainAmount: key !== 'expert' ? getCorrectCurrency([...coreInstruments, ...tacticInstruments], target.main.data.currency_id, course) : FV.toFixed(2),
      core: {
        selected: !!coreInstruments.find(i => i.name && i.price),
        instruments: {
          stock: filterInstruments(coreInstruments, course, 'stock'),
          bond: filterInstruments(coreInstruments, course, 'bond'),
          alternative: filterInstruments(coreInstruments, course, 'alternative'),
        },
        class_percents: getCorrectStructurePercents(key, false, course, assets, coreInstruments, 'class_' + course),
        bond_period_percents: getCorrectStructurePercents(key, false, course, assets, coreInstruments, 'matdate'),
        country_percents: getCorrectStructurePercents(key, false, course, assets, coreInstruments, 'country_' + course),
        currency_percents: getCorrectStructurePercents(key, false, course, assets, coreInstruments, `base_currency_${course}_id`),
        section_percents: getCorrectStructurePercents(key, false, course, assets, coreInstruments, 'section_' + course),
        conserv_percents: getCorrectStructurePercents(key, false, course, assets, coreInstruments, 'instrument_type_' + course),
        stock_risk_percents: getCorrectStructurePercents(key, false, course, assets, coreInstruments, 'instrument_type_' + course, 'instrument_type_' + course, ['Акции', 'Отраслевые ETF и БПИФ', 'ETF и БПИФ на акции широкого рынка (не отраслевые)']),
        stock_percents: getCorrectStructurePercents(key, false, course, assets, coreInstruments, 'section_' + course, 'instrument_type_' + course, ['Акции', 'Отраслевые ETF и БПИФ']),
        index,
      },
      tactic: {
        selected: portfolio.sections[2] ? portfolio.sections[2].selected : false,
        instruments: tacticInstruments,
        entryPoints: !!tacticInstruments.find(i => i.entryPoint),
        exitPoints: !!tacticInstruments.find(i => i.exitPoint)
      },
      comments: {
        common: getCorrectComment(portfolio, 'conclusion-comment'),
        stock: getCorrectComment(portfolio, 'stock-comment'),
        bond: getCorrectComment(portfolio, 'bond-comment'),
        alternative: getCorrectComment(portfolio, 'alternative-comment'),
        tactic: getCorrectComment(portfolio, 'tactic-comment'),
      }
    }];
    index++;
  }
  return portfolios;
};

function getCorrectInstrumentComment(comment = '', commentInstrument = '') {
  const c_comment = comment + (commentInstrument ? (!comment.trim() ? '' : '\n\n') + commentInstrument : '');
  const array = c_comment.trim().split('\n'); 
  const text = array.reduce((acc, element) => {
    return acc + `<div class="space" ${!element ? 'style="padding: 5px 0"' : `style="margin: 0;"`}>${element.replace(/\b(([\w-]+:\/\/?|www[.])[^\s()<>]+(?:\([\w\d]+\)|([^[:punct:]\s]|)))/g,'<a style="color: rgb(0, 89, 255);" target="_blank" href="$1">$1</a>').replace(/([*].+?[*])/g, '<strong>$1</strong>').replace(/\*/g, '').trim() + '\n'}</div>`;
  }, '');
  return text === `<div class="space" style="padding: 5px 0">\n</div>` ? '' : text;
}

function getCorrectComment(portfolio: Questionnaire.QTargetPortfolio, name: string) {
  const section = portfolio.sections.find(s => s.default === name);
  const array: Array<string> = (section && section.modules[0]) ? section.modules[0].data.comment.trim().split('\n') : [];
  const text = array.reduce((acc, element) => {
    return acc + `<div class="space" ${!element.trim() ? 'style="padding: 5px 0"' : `style="margin: 0;"`}>${element.replace(/\b(([\w-]+:\/\/?|www[.])[^\s()<>]+(?:\([\w\d]+\)|([^[:punct:]\s]|)))/g,'<a style="color: rgb(0, 89, 255);" target="_blank" href="$1">$1</a>').replace(/([*].+?[*])/g, '<strong>$1</strong>').replace(/\*/g, '').trim() + '\n'}</div>`;
  }, '');
  return text === `<div class="space" style="padding: 5px 0">\n</div>` ? '' : text;
}