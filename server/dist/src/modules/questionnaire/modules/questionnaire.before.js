"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixInstruments = exports.getCurrentPrices = exports.fixSections = exports.getCurrentPercents = exports.getCurrentFV = exports.fillInstruments = exports.collectionComments = void 0;
const user_model_1 = __importDefault(require("../../user/user.model"));
const investment_model_1 = __importDefault(require("../../investment/investment.model"));
const currency_model_1 = __importDefault(require("../../currency/currency.model"));
const exchange_controller_1 = require("../../exchange/exchange.controller");
const common_1 = require("../templates/modules/common");
const enums_1 = require("../../../utils/enums");
const collectionComments = function (questionnaire, _id) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield user_model_1.default.findById(_id);
        if (!user)
            return;
        questionnaire.content_EXPERT.targets.data.forEach((t) => {
            if (t.conclusion.sections[3].modules[0].data.comment || t.conclusion.sections[3].modules[0].data.comment === '')
                t.conclusion.sections[3].modules[0].data.comment = user.comments.target || '';
            if (t.portfolios.existing.sections[3].modules[0].data.comment || t.portfolios.existing.sections[3].modules[0].data.comment === '')
                t.portfolios.existing.sections[3].modules[0].data.comment = user.comments.existing || '';
            if (t.portfolios.expert.sections[2] &&
                t.portfolios.expert.sections[2].modules &&
                t.portfolios.expert.sections[2].modules[0] &&
                t.portfolios.expert.sections[2].modules[0].data &&
                (t.portfolios.expert.sections[2].modules[0].data.comment || t.portfolios.expert.sections[2].modules[0].data.comment === ''))
                t.portfolios.expert.sections[2].modules[0].data.comment = user.comments.expert || '';
            if (questionnaire.course.type === enums_1.COURSES.ONE) {
                if (t.portfolios.student.sections[3].modules[0].data.comment || t.portfolios.student.sections[3].modules[0].data.comment === '')
                    t.portfolios.student.sections[3].modules[0].data.comment = user.comments.student || '';
            }
            else {
                if (t.portfolios.student.sections[3].modules[0].data.comment || t.portfolios.student.sections[3].modules[0].data.comment === '')
                    t.portfolios.student.sections[3].modules[0].data.comment = user.comments.stock || '';
                if (t.portfolios.student.sections[4].modules[0].data.comment || t.portfolios.student.sections[4].modules[0].data.comment === '')
                    t.portfolios.student.sections[4].modules[0].data.comment = user.comments.bond || '';
                if (t.portfolios.student.sections[5].modules[0].data.comment || t.portfolios.student.sections[5].modules[0].data.comment === '')
                    t.portfolios.student.sections[5].modules[0].data.comment = user.comments.alternative || '';
                if (t.portfolios.student.sections[6].modules[0].data.comment || t.portfolios.student.sections[6].modules[0].data.comment === '')
                    t.portfolios.student.sections[6].modules[0].data.comment = user.comments.tactic || '';
            }
        });
        if (questionnaire.content_EXPERT.comment.data.module.data.comment || questionnaire.content_EXPERT.comment.data.module.data.comment === '') {
            questionnaire.content_EXPERT.comment.data.module.data.comment = user.comments.common || '';
        }
    });
};
exports.collectionComments = collectionComments;
const fillInstruments = function (questionnaire, _id) {
    return __awaiter(this, void 0, void 0, function* () {
        const course = questionnaire.course.type;
        const keys = getInstrumentKeys(course);
        const instruments = yield investment_model_1.default.find().lean();
        const ids = ['student', 'existing'];
        const sections = [1, 2];
        let inst = [];
        questionnaire.content_EXPERT.targets.data.forEach((t) => {
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
                        if (inst.find(i => i.trim().toLowerCase() === m.data.name.trim().toLowerCase()))
                            continue;
                        if (instrument) {
                            const comment = instrument.comments.find((c) => String(c._id) === String(_id));
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
    });
};
exports.fillInstruments = fillInstruments;
const getCurrentFV = function (questionnaire) {
    try {
        const currentTerm = (term) => {
            return (term.duration_id === 'MONTH') ? Number(term.term) / 12 : Number(term.term);
        };
        const FV = (income, inflation, term) => {
            return (Number(income) * Math.pow(1 + inflation, term)).toFixed(1);
        };
        questionnaire.content_EXPERT.targets.data.forEach((t) => {
            const { inflation, profitability } = t.main.data;
            const term = t.type.sections[1].modules[0].data;
            const correctInflation = inflation / 100;
            const correctProfitability = (profitability / 100) || 0.10;
            const amount = t.type.sections[0].modules[0].data.amount;
            const current_term = currentTerm(term);
            let fv = Number(FV(amount, correctInflation, current_term));
            const capital = (fv * 12) / correctProfitability;
            if (t.type.id === 2)
                fv = capital;
            t.type.sections[3].modules[0].data.fv = `${fv.toFixed(2)} ${t.main.data.currency_sign}`;
        });
    }
    catch (err) { }
};
exports.getCurrentFV = getCurrentFV;
const getCurrentPercents = function (questionnaire) {
    const course = questionnaire.course.type;
    questionnaire.content_EXPERT.targets.data.forEach((t) => {
        const sections = [1, 2];
        const amount = t.type.sections[2].modules[0].data.amount;
        const currency = t.main.data.currency_id;
        for (const section of sections) {
            t.portfolios.student.sections[section].modules.forEach((m) => {
                if (m.data.name && m.data.price) {
                    const total = getCurrency(m.data, currency, course) * m.data.number_papers;
                    const percent = Number(((total / amount) * 100).toFixed(2));
                    m.data.percent = percent;
                }
            });
        }
    });
};
exports.getCurrentPercents = getCurrentPercents;
const fixSections = function (questionnaire) {
    const sections = [1, 2];
    questionnaire.content_EXPERT.targets.data.forEach((t) => {
        for (const portfolioID in t.portfolios) {
            if (portfolioID === 'expert')
                break;
            const portfolio = t.portfolios[portfolioID];
            for (const section of sections) {
                portfolio.sections[section].modules = portfolio.sections[section].modules.filter((m) => m.data.price && m.data.name);
            }
        }
    });
    questionnaire.content_STUDENT.targets.data.forEach((t) => {
        for (const portfolioID in t.portfolios) {
            if (portfolioID === 'expert')
                break;
            const portfolio = t.portfolios[portfolioID];
            for (const section of sections) {
                portfolio.sections[section].modules = portfolio.sections[section].modules.filter((m) => m.data.price && m.data.name);
            }
        }
    });
};
exports.fixSections = fixSections;
const getCurrentPrices = function (questionnaire) {
    return __awaiter(this, void 0, void 0, function* () {
        const currencies = yield currency_model_1.default.find().lean();
        const course = questionnaire.course.type;
        const instruments = yield investment_model_1.default.find().select('price name').lean();
        let rates = (0, common_1.getCurrentExchangeRates)();
        const sections = [1, 2];
        questionnaire.content_EXPERT.targets.data.forEach((t) => {
            for (const portfolioID in t.portfolios) {
                if (portfolioID === 'expert')
                    break;
                const portfolio = t.portfolios[portfolioID];
                for (const section of sections) {
                    portfolio.sections[section].modules.forEach((m) => {
                        const result = (0, exchange_controller_1.getInstrumentPrice)(m.data.name);
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
                            }
                            else {
                                m.data.price = result.price;
                            }
                        }
                        else {
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
    });
};
exports.getCurrentPrices = getCurrentPrices;
const fixInstruments = function (questionnaire) {
    const classes = getClasses();
    const course = questionnaire.course.type;
    for (const target of questionnaire.content_EXPERT.targets.data) {
        const keys = Object.typedKeys(target.portfolios);
        for (const portfolioID of keys) {
            if (portfolioID === 'expert')
                break;
            const portfolio = target.portfolios[portfolioID];
            const sections = [1, 2];
            for (const section of sections) {
                for (const m of portfolio.sections[section].modules) {
                    if (!m.data[`class_${course}_id`] && m.data[`class_${course}`]) {
                        const c_class = classes.find((c) => c[course] === m.data[`class_${course}`]);
                        if (c_class)
                            m.data[`class_${course}_id`] = c_class._id;
                    }
                }
            }
        }
    }
};
exports.fixInstruments = fixInstruments;
function getCurrency(instrument, currency, course) {
    let rates = (0, common_1.getCurrentExchangeRates)();
    let lot = (course === enums_1.COURSES.TWO && instrument.lot) ? instrument.lot : 1;
    return ((instrument.price * lot / rates[instrument[`currency_${course}_id`]]) * rates[currency]);
}
;
function getInstrumentKeys(course) {
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
    ];
}
function getClasses() {
    return [
        { _id: 'stock', one: 'Акция', two: 'Рисковая часть' },
        { _id: 'bond', one: 'Облигации', two: 'Консервативная часть' },
        { _id: 'alternative', one: 'Альтернативные инвестиции', two: 'Защитная часть' },
    ];
}
exports.default = { collectionComments: exports.collectionComments, fillInstruments: exports.fillInstruments, getCurrentFV: exports.getCurrentFV, getCurrentPercents: exports.getCurrentPercents, fixSections: exports.fixSections, getCurrentPrices: exports.getCurrentPrices, fixInstruments: exports.fixInstruments };
//# sourceMappingURL=questionnaire.before.js.map