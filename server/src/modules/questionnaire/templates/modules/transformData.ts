import correctDescription from './correctEnd';
import getCurrentPortfolios from './portfolio';
import calculation from './calculation';
import { firstQuestionnaireRisks, secondQuestionnaireRisks, periods, getCurrentExchangeRates, base64_encode } from './common';
import { COURSES } from '@/utils/enums';
import { dynamicsObject, valueof } from '@/interfaces/index';
import { Questionnaire } from '../../dto/questionnaire.dto';

export function getCorrectCurrency(datas: Array<dynamicsObject>, currency: string) {
  const rates = getCurrentExchangeRates();
  return datas.reduce((acc, data) => acc + (data.data.amount / rates[data.data.currency_id] * rates[currency]), 0).toFixed(0);
}

export function getCorrectPortfolioTag(portfolio: string, course: valueof<typeof COURSES>) {
  const risk = course === 'one' ?
    firstQuestionnaireRisks.find(p => p.name === portfolio) :
    secondQuestionnaireRisks.find(p => p.name === portfolio);
  risk.icon = base64_encode(__dirname + '/..' + risk.src);
  return risk;
}

export function getCorrectPeriod(period: keyof typeof periods) {
  return periods[period];
}

export function getCorrectInstrumentComment(comment = '') {
  const array = comment.split('\n'); 
  const text = array.reduce((acc, element) => {
    return acc + `<div class="space" ${!element.trim() ? 'style="width: 100%; height: 10px; margin-bottom: 0"' : 'style="margin-bottom: 0"'}>${element.replace(/\b(([\w-]+:\/\/?|www[.])[^\s()<>]+(?:\([\w\d]+\)|([^[:punct:]\s]|)))/g,'<a style="color: rgb(0, 89, 255);" target="_blank" href="$1">$1</a>').replace(/([*].+?[*])/g, '<strong>$1</strong>').replace(/\*/g, '').trim() + '\n'}</div>`;
  }, '');
  return text === `<div class="space" style="width: 100%; height: 10px;">\n</div>` ? '' : text;
}


export default (questionnaire: Questionnaire.QContent, course: valueof<typeof COURSES>, assets: Array<dynamicsObject>, combine = false) => {
  let targets: Array<dynamicsObject> = [];

  questionnaire.targets.data.forEach((target) => {
    const term = target.type.sections[1].modules[0].data;
    const period = target.conclusion.sections[0].modules[0].data.period_id;
    const targetCurrency = target.main.data.currency_id;
    const targetCurrencySign = target.main.data.currency_sign;

    const { profitability, inflation } = target.main.data;
    const correctProfitability = profitability / 100;
    const correctInflation = inflation / 100;

    const current_term = calculation.currentTerm(term);
    const income = getCorrectCurrency(target.type.sections[0].modules, targetCurrency);
    const resourses = getCorrectCurrency(target.type.sections[4].modules, targetCurrency);

    let FV = Number(calculation.FV(income, correctInflation, current_term));
    let FVS = Number(calculation.FV(income, correctInflation, current_term));
    const FV1 = Number(calculation.FV1(resourses, correctProfitability, current_term));

    const capital = FV * 12 / correctProfitability;
    if (target.type.id === 2) FV = capital;

    if (combine) {
      FV = FVS = Number(target.type.sections[3].modules[0].data.fv.replace(` ${target.main.data.currency_sign}`, ''));
    }

    const percent = (FV1 / FV) * 100;
    const FV2 = FV - FV1;
    const R = (FV2 / ((Math.pow(1 + correctProfitability, current_term) - 1) / correctProfitability));
    const currentPeriod = calculation.currentPeriod(period);
    const currentMonths = calculation.currentMonths(period);
    const currentR = R / currentPeriod < 0 ? 0 : Number((R / currentPeriod).toFixed(0));

    const correctTarget = {
      id: target.id,
      number: target.id,
      name: target.main.data.name.replace(/\s{2,}/g, ' ').trim(),
      mainCurrency: targetCurrency,
      type: target.type.id,
      income,
      term: `${term.term} ${correctDescription(term)}`,
      resourses,
      riskPortfolio: getCorrectPortfolioTag(target.type.sections[5].modules[0].data.portfolio, course),
      conclusion: {
        amount: '0',
        period: getCorrectPeriod(period),
        replenishment: getCorrectCurrency(target.conclusion.sections[1].modules, targetCurrency),
        comment: getCorrectInstrumentComment(target.conclusion.sections[3].modules[0].data.comment)
      },
      chart: [] as Array<dynamicsObject>,
      portfolios: getCurrentPortfolios(target, course, assets, FV),
      status: target.status,
      capital: '0',
      passive: '0',
      percent: '0'
    }

    correctTarget.capital = capital.toFixed(1);
    correctTarget.passive = FVS.toFixed(1);
    correctTarget.percent = percent > 100 ? '100' : percent.toFixed(1);
    correctTarget.conclusion.amount = FV2 < 0 ? '0' : FV2.toFixed(1);

    correctTarget.chart = calculation.chartFill(target.type.sections[4].modules, current_term, currentPeriod, currentMonths, correctProfitability, targetCurrency, targetCurrencySign, getCorrectCurrency, course, currentR);
    console.log('pdf done');
    targets = [...targets, correctTarget];
  });

  return targets;
};