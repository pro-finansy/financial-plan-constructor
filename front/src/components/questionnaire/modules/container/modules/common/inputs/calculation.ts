import { dynamicsObject } from "@/interfaces";
import { Questionnaire } from "@/interfaces/dto/questionnaire";
import { COURSES_ENUM, DURATION_ENUM, PERIODS_ENUM } from "@/utils/enums";

function getCorrectCurrency(datas: Array<Questionnaire.QSectionModules>, currency: string, currencies: dynamicsObject) {
  return datas.reduce((acc, data) => acc + (data.data.amount / currencies[data.data.currency_id] * currencies[currency]), 0).toFixed(1);
};
function convertCurrency(price: number, currency: string, correctCurrency: string, currencies: dynamicsObject) {
  return (price / currencies[currency] * currencies[correctCurrency]);
};

export const calculationRealityRepleshment = (self: any) => {
  const currentTarget: Questionnaire.QTarget = self.questionnaire.targets.find((t: Questionnaire.QTarget) => t.id === self.targetId);
  const inflation = currentTarget.main.data.inflation / 100;
  const profitability = currentTarget.main.data.profitability / 100 || 0;
  const currentTargetIncome = currentTarget.type.sections[0].modules;
  const currentTargetResourses = currentTarget.type.sections[4].modules;
  const income = getCorrectCurrency(currentTargetIncome, currentTarget.main.data.currency_id, self.currencies);
  const resourses = getCorrectCurrency(currentTargetResourses, currentTarget.main.data.currency_id, self.currencies);
  const period = currentTarget.conclusion.sections[0].modules[0].data.period_id;

  const currentTerm = currentTarget.type.sections[1].modules[0].data;
  const term = (currentTerm.duration_id === DURATION_ENUM.MONTH) ? Number(currentTerm.term) / 12 : Number(currentTerm.term);

  let FV = (Number(income) * Math.pow(1 + inflation, term));
  const FV1 = (Number(resourses) * Math.pow(1 + profitability, term));
  const capital = FV * 12 / profitability;
  if (currentTarget.type.id === 2) FV = capital;

  if (self.uncombine && self.course === COURSES_ENUM.ONE) {
    FV = currentTarget.type.sections[3].modules[0].data.fv.replace(` ${currentTarget.main.data.currency_sign}`, '');
  }

  const FV2 = FV - FV1;
  const R = (FV2 / ((Math.pow(1 + profitability, term) - 1) / profitability));
  if (period === PERIODS_ENUM.NOT_PERIOD) return currentTarget.conclusion.sections[2].modules[0].data.amount = 0;
  const currentPeriod = (period === PERIODS_ENUM.MONTHLY) ? 12 : (period === PERIODS_ENUM.QUARTERLY) ? 4 : (period === PERIODS_ENUM.SEMIANNUALLY) ? 2 : 1;
  const currentR = R / currentPeriod < 0 ? 0 : Number((R / currentPeriod).toFixed(1));
  currentTarget.conclusion.sections[2].modules[0].data.amount = Number(currentR);
};

export const calculationNumberPapers = (self: any) => {
  const currentTarget = self.questionnaire.targets.find((t: Questionnaire.QTarget) => t.id === self.targetId);
  const currentPortfolio = currentTarget.portfolios[self.portfolioId]
  const currentTargetIncome = currentTarget.type.sections[0].modules;
  const currentTerm = currentTarget.type.sections[1].modules[0].data;

  const inflation = currentTarget.main.data.inflation / 100;
  const profitability = currentTarget.main.data.profitability / 100 || 0;
  const income = getCorrectCurrency(currentTargetIncome, currentTarget.main.data.currency_id, self.currencies);
  const term = (currentTerm.duration_id === DURATION_ENUM.MONTH) ? Number(currentTerm.term) / 12 : Number(currentTerm.term);
  const corePercents = currentPortfolio.sections[0].modules[0].data.core;

  let FV = (Number(income) * Math.pow(1 + inflation, term));
  const capital = FV * 12 / profitability;
  if (currentTarget.type.id === 2) FV = capital;

  const amount = FV * (corePercents / 100);
  const instrumentAmount = amount * (self.module.data.percent / 100);
  const currentNumberPapers = Math.floor(instrumentAmount / convertCurrency(self.module.data.price, self.module.data[`currency_${self.course}_id`], currentTarget.main.data.currency_id, self.currencies));
  self.module.data.number_papers = currentNumberPapers || 0;
}

export const calculationFV = (self: any) => {
  try {
    const currentTarget: Questionnaire.QTarget = self.questionnaire.targets.find((t: Questionnaire.QTarget) => t.id === self.targetId);
    const currentTargetType = currentTarget.type.id;
    const currentInflation = currentTarget.main.data.inflation;
    const currentProfitability = currentTarget.main.data.profitability || 0;
    const currentTerm = currentTarget.type.sections[1].modules[0].data;

    currentTarget.type.sections[0].modules.forEach((currentAmount, index) => {
      const currentFv = currentTarget.type.sections[3].modules[index].data;
      if ((!currentInflation && currentInflation !== 0) || !currentAmount.data.amount || !currentTerm.term || !currentTerm.duration_id) return currentFv.fv = '';

      const currentTermValue = (currentTerm.duration_id === DURATION_ENUM.MONTH) ? Number(currentTerm.term) / 12 : Number(currentTerm.term);
      const fv = currentTargetType === 1 ?
        (currentAmount.data.amount * Math.pow((1 + Number(currentInflation) / 100), currentTermValue)).toFixed(1) :
        ((currentAmount.data.amount * 12 * 100 / currentProfitability) * Math.pow((1 + Number(currentInflation) / 100), currentTermValue)).toFixed(1);

      currentFv.fv = `${fv} ${currentAmount.data.currency_sign}`;
    })

  } catch (error) { return }
}