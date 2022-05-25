import { dynamicsObject } from '@/interfaces';
import { Questionnaire } from '@/interfaces/dto/questionnaire';
import { ROLES_ENUM } from '@/utils/enums';
import { firstType } from "./type";

function getOtherCurrency(rates: dynamicsObject, amount: number, currency: string, baseCurrency: string) {
  return Math.ceil10(amount / rates[currency] * rates[baseCurrency], -1);
};
function getUSDCurrency(rates: dynamicsObject, amount: number, currency: string) {
  return amount / rates[currency];
};
function uniqueInstruments(array: Array<Questionnaire.QSectionModules>) {
  let result: Array<Questionnaire.QSectionModules> = [];
  array = array.reverse();
  for (const el of array) {
    const i = result.find(r => r.data.name.toLowerCase().trim() === el.data.name.toLowerCase().trim());
    if (!i) {
      result = [...result, JSON.parse(JSON.stringify(el))];
    } else {
      i.data.number_papers = Number(i.data.number_papers) + Number(el.data.number_papers);
      i.data.formula = Math.ceil10(i.data.number_papers * i.data.price, -1);
    }
  }
  return result;
}
const FV = (income: number, inflation: number, term: number) => {
  return Math.ceil10(income * Math.pow(1 + inflation, term), -1);
};
function calculationFV(currentTarget: Questionnaire.QTarget) {
  const currentTargetType = currentTarget.type.id;
  const currentInflation = currentTarget.main.data.inflation / 100;
  const currentProfitability = (currentTarget.main.data.profitability / 100) || 0.10;
  const currentTerm = currentTarget.type.sections[1].modules[0].data;
  let cfv = 0;

  currentTarget.type.sections[0].modules.forEach((currentAmount, index) => {
    const currentFv = currentTarget.type.sections[3].modules[index].data;
    if (!currentInflation || !currentAmount.data.amount || !currentTerm.term || !currentTerm.duration_id) return currentFv.fv = '';
    const currentTermValue = (currentTerm.duration_id === 'MONTH') ? Number(currentTerm.term) / 12 : Number(currentTerm.term);
    let fv = FV(currentAmount.data.amount, currentInflation, currentTermValue);
    if (currentTargetType === 2) {
      fv = (fv * 12) / currentProfitability
    }
    cfv = Math.ceil10(fv, -1);
  });
  return cfv;
}
function calculationRealityRepleshment(currentTarget: Questionnaire.QTarget) {
  const inflation = currentTarget.main.data.inflation / 100;
  const profitability = currentTarget.main.data.profitability / 100 || 0;
  const income = currentTarget.type.sections[0].modules[0].data.amount;
  const resourses = currentTarget.type.sections[4].modules[0].data.amount;
  const period = currentTarget.conclusion.sections[0].modules[0].data.period_id;

  const currentTerm = currentTarget.type.sections[1].modules[0].data;
  const term = (currentTerm.duration_id === 'MONTH') ? Number(currentTerm.term) / 12 : Number(currentTerm.term);

  let FV = (Number(income) * Math.pow(1 + inflation, term));
  const FV1 = (resourses * Math.pow(1 + profitability, term));
  const capital = FV * 12 / profitability;
  if (currentTarget.type.id === 2) FV = capital;

  FV = currentTarget.type.sections[3].modules[0].data.fv.replace(` ${currentTarget.main.data.currency_sign}`, '');

  const FV2 = FV - FV1;
  const R = (FV2 / ((Math.pow(1 + profitability, term) - 1) / profitability));
  
  if (period === 'NOT_PERIOD') return currentTarget.conclusion.sections[2].modules[0].data.amount = 0;

  const currentPeriod = (period === 'MONTHLY') ? 12 : (period === 'QUARTERLY') ? 4 : (period === 'SEMIANNUALLY') ? 2 : 1;
  const currentR = R / currentPeriod < 0 ? 0 : Math.ceil10(R / currentPeriod, -1);
  currentTarget.conclusion.sections[2].modules[0].data.amount = Number(currentR);
}
function collectionTargetType(_role: keyof typeof ROLES_ENUM, targets: Array<Questionnaire.QTarget>, newTarget: Questionnaire.QTarget, rates: dynamicsObject) {
  const targetType = firstType;
  
  newTarget.main.data.type = targetType.name;
  newTarget.main.data.type_id = targetType.id;
  newTarget.type.id = targetType.id;
  newTarget.type.name = targetType.name;
  newTarget.type.sections[0].name = targetType.section_name;

  const commonMainVariables = ["inflation", "currency", "currency_id", "currency_sign", "profitability"];
  for (const key of commonMainVariables) {
    newTarget.main.data[key] = targets[0].main.data[key];
  }
  const newTargetMainCurrencyName = newTarget.main.data.currency;
  const newTargetMainCurrency = newTarget.main.data.currency_id;
  const newTargetMainCurrencySign = newTarget.main.data.currency_sign;

  const commonTypeCurrencyIndexes = [0, 2, 4];
  const commonTypeCurrencyVariables = ['currency', 'currency_id', 'currency_sign'];
  for (const index of commonTypeCurrencyIndexes) {
    for (const key of commonTypeCurrencyVariables) {
      newTarget.type.sections[index].modules[0].data[key] = targets[0].type.sections[index].modules[0].data[key];
    }
    const arr = targets.map(t => t.type.sections[index].modules).reduce((acc, arr) => acc.concat(arr));
    const commonIndexAmount = arr.map(m => m.data).reduce((acc, income) => acc + getUSDCurrency(rates, income.amount, income.currency_id), 0);
    newTarget.type.sections[index].modules[0].data.amount = Math.ceil10(getOtherCurrency(rates, commonIndexAmount, 'USD', newTargetMainCurrency), -1);
    newTarget.type.sections[index].modules[0].data.currency_id = newTargetMainCurrency;
    newTarget.type.sections[index].modules[0].data.currency_sign = newTargetMainCurrencySign;
    newTarget.type.sections[index].modules[0].data.currency = newTargetMainCurrencyName;
  }
  newTarget.type.sections[5].modules = targets[0].type.sections[5].modules;

  targets.forEach((target) => {
    const statuses = Object.typedKeys(newTarget.status);
    for (const key of statuses) {
      if (target.status[key] > newTarget.status[key]) {
        newTarget.status[key] = target.status[key];
      }
    }
  });
  if (newTarget.status.existing === 0) newTarget.status.existing = -1;
  let terms: Array<number> = [];
  for (const target of targets) {
    const term = target.type.sections[1].modules[0].data;
    const duration = term.term * ((term.duration_id === 'YEAR') ? 1 : 12);
    terms = [...terms, duration];
  }
  const max = Math.max.apply(null, terms);
  const currentIndex = terms.indexOf(max);
  newTarget.type.sections[1].modules = targets[currentIndex].type.sections[1].modules;

  let totalFv = 0;
  for (const target of targets) {
    totalFv += calculationFV(target);
  }
  newTarget.type.sections[3].modules[0].data.fv = `${Math.ceil10(totalFv, -2)} ${newTarget.type.sections[0].modules[0].data.currency_sign}`;
}
function collectionTargetConclusion(role: keyof typeof ROLES_ENUM, targets: Array<Questionnaire.QTarget>, newTarget: Questionnaire.QTarget, rates: dynamicsObject) {
  const newTargetMainCurrency = newTarget.main.data.currency_id;

  newTarget.conclusion.sections[0].modules = targets[0].conclusion.sections[0].modules;
  const arr = targets.map(t => t.conclusion.sections[1].modules).reduce((acc, arr) => acc.concat(arr));
  const commonIndexAmount = arr.map(m => m.data).reduce((acc, income) => acc + getUSDCurrency(rates, income.amount, income.currency_id), 0);
  newTarget.conclusion.sections[1].modules[0].data.amount = getOtherCurrency(rates, commonIndexAmount, 'USD', newTargetMainCurrency);
  newTarget.conclusion.sections[1].modules[0].data.currency_id = newTargetMainCurrency;
  newTarget.conclusion.sections[1].modules[0].data.currency = newTarget.main.data.currency;
  newTarget.conclusion.sections[1].modules[0].data.currency_sign = newTarget.main.data.currency_sign;

  if (role === ROLES_ENUM.EXPERT) {
    calculationRealityRepleshment(newTarget);
    newTarget.conclusion.sections[3].modules[0].data.comment = targets.map((t) => t.conclusion.sections[3].modules[0].data.comment).join(" + ");
  }
  if (role === ROLES_ENUM.STUDENT) {
    const commonRealityRepleshment = targets.map(t => ({ amount: t.conclusion.sections[2].modules[0].data.amount, currency_id: t.main.data.currency_id })).reduce((acc, amount) => acc + getUSDCurrency(rates, amount.amount, amount.currency_id), 0);
    newTarget.conclusion.sections[2].modules[0].data.amount = getOtherCurrency(rates, commonRealityRepleshment, 'USD', newTargetMainCurrency);
    newTarget.conclusion.sections[4].modules = targets[0].conclusion.sections[4].modules;
    newTarget.conclusion.sections[5].modules[0].data.student_comment = targets.map((t) => t.conclusion.sections[5].modules[0].data.student_comment).join(' + ');
  }

}
const getCurrency = (instrument: dynamicsObject, currency: string, rates: dynamicsObject) => {
  return ((instrument.price * 1 * instrument.number_papers / rates[instrument[`currency_one_id`]]) * rates[currency]);
};

function collectionTargetPortfolios(_role: keyof typeof ROLES_ENUM, targets: Array<Questionnaire.QTarget>, newTarget: Questionnaire.QTarget, rates: dynamicsObject) {
  const portfolios: Array<Questionnaire.Portfolios> = ['existing', 'expert', 'student'];
  const indexes = [1, 2];
  for (const portfolioId of portfolios) {
    if (newTarget.status[portfolioId] !== 1) continue;
    for (const index of indexes) {
      if (newTarget.portfolios[portfolioId].sections[index].adding) {
        const arr = targets.map(t => t.portfolios[portfolioId].sections[index].modules).reduce((acc, arr) => acc.concat(arr));
        const instruments = arr.filter(i => i.data.name && i.data.price);
        newTarget.portfolios[portfolioId].sections[index].modules = [...uniqueInstruments(instruments), ...newTarget.portfolios[portfolioId].sections[index].modules.filter(i => i.data.name && i.data.price)];
      }
      if (index === 2 && portfolioId !== 'expert') {
        const arr = targets.map(t => t.portfolios[portfolioId].sections[2].selected)
        const tactic = arr.filter(t => t);
        newTarget.portfolios[portfolioId].sections[2].selected = !!(tactic.length > 0);
      }
      newTarget.portfolios[portfolioId].sections[index].modules.forEach((m, index) => {
        m.data.index = index;
      });
    }
    newTarget.portfolios[portfolioId].sections[0].modules = targets[0].portfolios[portfolioId].sections[0].modules;
    const indexExpertComment = newTarget.portfolios[portfolioId].sections.findIndex(s => s.default === 'conclusion-comment');
    newTarget.portfolios[portfolioId].sections[indexExpertComment].modules[0].data.comment = targets.map((t) => t.portfolios[portfolioId].sections[indexExpertComment].modules[0].data.comment).join(" + ");
    if (portfolioId === 'expert') {
      const fv = newTarget.type.sections[3].modules[0].data.fv.replace(` ${newTarget.type.sections[0].modules[0].data.currency_sign}`, '');
      const core = Number(fv) * (newTarget.portfolios.expert.sections[0].modules[0].data.core / 100);
      newTarget.portfolios.expert.sections[1].modules.forEach(m => {
        const amount = getCurrency(m.data, newTarget.main.data.currency_id, rates);
        m.data.percent = Math.ceil10(amount / core * 100, -2);
      })
    }
  }
}

const collectionCombineTarget = (role: keyof typeof ROLES_ENUM, targets: Array<number>, qtargets: Array<Questionnaire.QTarget>, newTarget: Questionnaire.QTarget, rates: dynamicsObject) => {
  const ctargets = qtargets.filter(t => targets.includes(t.id));
  newTarget.main.data.name = ctargets.map((t) => t.main.data.name).join(" и ");
  collectionTargetType(role, ctargets, newTarget, rates);
  collectionTargetConclusion(role, ctargets, newTarget, rates);
  collectionTargetPortfolios(role, ctargets, newTarget, rates);
};

export { collectionCombineTarget };
