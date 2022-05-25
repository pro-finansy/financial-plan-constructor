import { ObjectId } from "mongoose";

import { dynamicsObject, valueof } from "@/interfaces";
import { currentTerm, FV } from "../questionnaire.interfaces";

import userModel from "../../user/user.model";
import investmentModel from "../../investment/investment.model";
import currencyModel from "../../currency/currency.model";
import { getInstrumentPrice } from "../../exchange/exchange.controller";

import { getCurrentExchangeRates } from '../templates/modules/common';
import { COURSES } from "../../../utils/enums";
import { Questionnaire } from "../dto/questionnaire.dto";

export const collectionComments = async function(questionnaire: Questionnaire.Dto, _id: ObjectId) {
  const user = await userModel.findById(_id);
  if (!user) return;
  questionnaire.content_EXPERT.targets.data.forEach((t: dynamicsObject) => {
    if (t.conclusion.sections[3].modules[0].data.comment || t.conclusion.sections[3].modules[0].data.comment === '') t.conclusion.sections[3].modules[0].data.comment = user.comments.target || '';
    if (t.portfolios.existing.sections[3].modules[0].data.comment || t.portfolios.existing.sections[3].modules[0].data.comment === '') t.portfolios.existing.sections[3].modules[0].data.comment = user.comments.existing || '';
    if (t.portfolios.expert.sections[2] && 
      t.portfolios.expert.sections[2].modules &&
      t.portfolios.expert.sections[2].modules[0] &&
      t.portfolios.expert.sections[2].modules[0].data &&
      (t.portfolios.expert.sections[2].modules[0].data.comment || t.portfolios.expert.sections[2].modules[0].data.comment === '')) t.portfolios.expert.sections[2].modules[0].data.comment = user.comments.expert || '';
    if (questionnaire.course.type === COURSES.ONE) {
      if (t.portfolios.student.sections[3].modules[0].data.comment || t.portfolios.student.sections[3].modules[0].data.comment === '') t.portfolios.student.sections[3].modules[0].data.comment = user.comments.student || '';
    } else {
      if (t.portfolios.student.sections[3].modules[0].data.comment || t.portfolios.student.sections[3].modules[0].data.comment === '') t.portfolios.student.sections[3].modules[0].data.comment = user.comments.stock || '';
      if (t.portfolios.student.sections[4].modules[0].data.comment || t.portfolios.student.sections[4].modules[0].data.comment === '') t.portfolios.student.sections[4].modules[0].data.comment = user.comments.bond || '';
      if (t.portfolios.student.sections[5].modules[0].data.comment || t.portfolios.student.sections[5].modules[0].data.comment === '') t.portfolios.student.sections[5].modules[0].data.comment = user.comments.alternative || '';
      if (t.portfolios.student.sections[6].modules[0].data.comment || t.portfolios.student.sections[6].modules[0].data.comment === '') t.portfolios.student.sections[6].modules[0].data.comment = user.comments.tactic || '';
    }
  });
  if (questionnaire.content_EXPERT.comment.data.module.data.comment || questionnaire.content_EXPERT.comment.data.module.data.comment === '') {
    questionnaire.content_EXPERT.comment.data.module.data.comment = user.comments.common || '';
  }
}

export const fillInstruments = async function(questionnaire: Questionnaire.Dto, _id: ObjectId) {
  const course = questionnaire.course.type;
  const keys = getInstrumentKeys(course);
  const instruments = await investmentModel.find().lean();
  const ids = ['student', 'existing'];
  const sections = [1, 2];
  let inst: Array<dynamicsObject> = [];

  questionnaire.content_EXPERT.targets.data.forEach((t: dynamicsObject) => {
    for (const portfolioID of ids) {
      const portfolio = t.portfolios[portfolioID];
      for (const section of sections) {
        for (const m of portfolio.sections[section].modules) {
          const instrument = instruments.find((i) => i.name.trim().toLowerCase() === m.data.name.trim().toLowerCase());
          if (instrument) 
            for (const key of keys) {
              if (instrument[key] && !m.data[key]) {
                m.data[key] = instrument[key];
              }
            }
          if (inst.find(i => i.trim().toLowerCase() === m.data.name.trim().toLowerCase())) continue;
          if (instrument) {
            const comment = instrument.comments.find((c: dynamicsObject) => String(c._id) === String(_id));
            if (comment) {
              inst = [...inst, m.data.name];
              m.data.comment = comment.comment;
            }
          }
        }
      }
    }
  });
  questionnaire.markModified('content_EXPERT');
}

export const getCurrentFV = function(questionnaire: Questionnaire.Dto) {
  try {
    const currentTerm: currentTerm = (term) => {
      return (term.duration_id === 'MONTH') ? Number(term.term) / 12 : Number(term.term)
    };
    const FV: FV = (income, inflation, term) => {
      return (Number(income) * Math.pow(1 + inflation, term)).toFixed(1);
    };
    questionnaire.content_EXPERT.targets.data.forEach((t: dynamicsObject) => {
      const { inflation, profitability } = t.main.data;
      const term = t.type.sections[1].modules[0].data;
      const correctInflation = inflation / 100;
      const correctProfitability = (profitability / 100 ) || 0.10;
      const amount = t.type.sections[0].modules[0].data.amount;
      const current_term = currentTerm(term);
  
      let fv = Number(FV(
        amount,
        correctInflation,
        current_term
      ));
      const capital = (fv * 12) / correctProfitability;
      if (t.type.id === 2) fv = capital;
      t.type.sections[3].modules[0].data.fv = `${fv.toFixed(2)} ${t.main.data.currency_sign}`;
    });
  } catch (err) {}
}

export const getCurrentPercents = function(questionnaire: Questionnaire.Dto) {
  const course = questionnaire.course.type;
  questionnaire.content_EXPERT.targets.data.forEach((t: dynamicsObject) => {
    const sections = [1, 2];
    const amount = t.type.sections[2].modules[0].data.amount;
    const currency = t.main.data.currency_id;
    for (const section of sections) {
      t.portfolios.student.sections[section].modules.forEach((m: dynamicsObject) => {
        if (m.data.name && m.data.price) {
          const total = getCurrency(m.data, currency, course) * m.data.number_papers;
          const percent = Number(((total / amount) * 100).toFixed(2));
          m.data.percent = percent;
        }
      });
    }
  });
}

export const fixSections = function(questionnaire: Questionnaire.Dto) {
  const sections = [1, 2];
  questionnaire.content_EXPERT.targets.data.forEach((t: dynamicsObject) => {
    for (const portfolioID in t.portfolios) {
      if (portfolioID === 'expert') break;
      const portfolio = t.portfolios[portfolioID];
      for (const section of sections) {
        portfolio.sections[section].modules = portfolio.sections[section].modules.filter((m: dynamicsObject) => m.data.price && m.data.name);
      }
    }
  });
  questionnaire.content_STUDENT.targets.data.forEach((t: dynamicsObject) => {
    for (const portfolioID in t.portfolios) {
      if (portfolioID === 'expert') break;
      const portfolio = t.portfolios[portfolioID];
      for (const section of sections) {
        portfolio.sections[section].modules = portfolio.sections[section].modules.filter((m: dynamicsObject) => m.data.price && m.data.name);
      }
    }
  });
}

export const getCurrentPrices = async function(questionnaire: Questionnaire.Dto) {
  const currencies = await currencyModel.find().lean();
  const course = questionnaire.course.type;
  const instruments = await investmentModel.find().select('price name').lean();
  let rates = getCurrentExchangeRates();
  const sections = [1, 2];
  questionnaire.content_EXPERT.targets.data.forEach((t: dynamicsObject) => {
    for (const portfolioID in t.portfolios) {
      if (portfolioID === 'expert') break;
      const portfolio = t.portfolios[portfolioID];
      for (const section of sections) {
        portfolio.sections[section].modules.forEach((m: dynamicsObject) => {
          const result = getInstrumentPrice(m.data.name);
          if (result && result.price && result.currency) {
            if (m.data[`currency_${course}_id`] !== result.currency) {
              const currency = result.currency === 'SUR' ? 'RUB' : result.currency;
              const i_currency = m.data[`currency_${course}_id`] || currency;
              const c_currency = currencies.find(c => c.code.includes(i_currency));
              m.data.price = Number(((result.price / rates[currency]) * rates[i_currency]).toFixed(2));
              m.data.formula = Number((m.data.price * m.data.number_papers).toFixed(2));
              if (c_currency) {
                m.data[`currency_${course}_id`] = c_currency.code;
                m.data[`currency_${course}`] = c_currency.name;
              }
            } else {
              m.data.price = result.price;
            }
          } else {
            const instrument = instruments.find(i => m.data.name.trim().toLowerCase() === i.name.trim().toLowerCase());
            if (instrument) {
              m.data.price = instrument.price;
              m.data.formula = Number((m.data.price * m.data.number_papers).toFixed(2));
            }
          }
        });
      }
    }
  });
}

export const fixInstruments = function(questionnaire: Questionnaire.Dto) {
  const classes = getClasses();
  const course = questionnaire.course.type;
  for (const target of questionnaire.content_EXPERT.targets.data) {
    const keys = Object.typedKeys(target.portfolios);
    for (const portfolioID of keys) {
      if (portfolioID === 'expert') break;
      const portfolio = target.portfolios[portfolioID];
      const sections = [1, 2];
      for (const section of sections) {
        for (const m of portfolio.sections[section].modules) {
          if (!m.data[`class_${course}_id`] && m.data[`class_${course}`]) {
            const c_class = classes.find((c: dynamicsObject) => c[course] === m.data[`class_${course}`]);
            if (c_class) m.data[`class_${course}_id`] = c_class._id;
          }
        }
      }
    }
  }
};

function getCurrency (instrument: dynamicsObject, currency: string, course: valueof<typeof COURSES>) {
  let rates = getCurrentExchangeRates();
  let lot = (course === COURSES.TWO && instrument.lot) ? instrument.lot : 1;
  return ((instrument.price * lot / rates[instrument[`currency_${course}_id`]]) * rates[currency]);
};

function getInstrumentKeys(course: typeof COURSES[keyof typeof COURSES]) {
  return [
    `class_${course}`,
    `class_${course}_id`,
    `country_${course}`,
    `country_${course}_id`,
    `currency_${course}`,
    `currency_${course}_id`,
    `base_currency_${course}`,
    `base_currency_${course}_id`,
    `instrument_type_${course}`,
    `instrument_type_${course}_id`,
    `section_${course}`,
    `section_${course}_id`,
  ]
}

function getClasses() {
  return [
    { _id: 'stock', one: 'Акция', two: 'Рисковая часть' },
    { _id: 'bond', one: 'Облигации', two: 'Консервативная часть' },
    { _id: 'alternative', one: 'Альтернативные инвестиции', two: 'Защитная часть' },
  ]
}

export default { collectionComments, fillInstruments, getCurrentFV, getCurrentPercents, fixSections, getCurrentPrices, fixInstruments };