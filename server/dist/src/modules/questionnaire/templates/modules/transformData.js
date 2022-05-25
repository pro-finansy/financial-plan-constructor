"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCorrectInstrumentComment = exports.getCorrectPeriod = exports.getCorrectPortfolioTag = exports.getCorrectCurrency = void 0;
const correctEnd_1 = __importDefault(require("./correctEnd"));
const portfolio_1 = __importDefault(require("./portfolio"));
const calculation_1 = __importDefault(require("./calculation"));
const common_1 = require("./common");
function getCorrectCurrency(datas, currency) {
    const rates = (0, common_1.getCurrentExchangeRates)();
    return datas.reduce((acc, data) => acc + (data.data.amount / rates[data.data.currency_id] * rates[currency]), 0).toFixed(0);
}
exports.getCorrectCurrency = getCorrectCurrency;
function getCorrectPortfolioTag(portfolio, course) {
    const risk = course === 'one' ?
        common_1.firstQuestionnaireRisks.find(p => p.name === portfolio) :
        common_1.secondQuestionnaireRisks.find(p => p.name === portfolio);
    risk.icon = (0, common_1.base64_encode)(__dirname + '/..' + risk.src);
    return risk;
}
exports.getCorrectPortfolioTag = getCorrectPortfolioTag;
function getCorrectPeriod(period) {
    return common_1.periods[period];
}
exports.getCorrectPeriod = getCorrectPeriod;
function getCorrectInstrumentComment(comment = '') {
    const array = comment.split('\n');
    const text = array.reduce((acc, element) => {
        return acc + `<div class="space" ${!element.trim() ? 'style="width: 100%; height: 10px; margin-bottom: 0"' : 'style="margin-bottom: 0"'}>${element.replace(/\b(([\w-]+:\/\/?|www[.])[^\s()<>]+(?:\([\w\d]+\)|([^[:punct:]\s]|)))/g, '<a style="color: rgb(0, 89, 255);" target="_blank" href="$1">$1</a>').replace(/([*].+?[*])/g, '<strong>$1</strong>').replace(/\*/g, '').trim() + '\n'}</div>`;
    }, '');
    return text === `<div class="space" style="width: 100%; height: 10px;">\n</div>` ? '' : text;
}
exports.getCorrectInstrumentComment = getCorrectInstrumentComment;
exports.default = (questionnaire, course, assets, combine = false) => {
    let targets = [];
    questionnaire.targets.data.forEach((target) => {
        const term = target.type.sections[1].modules[0].data;
        const period = target.conclusion.sections[0].modules[0].data.period_id;
        const targetCurrency = target.main.data.currency_id;
        const targetCurrencySign = target.main.data.currency_sign;
        const { profitability, inflation } = target.main.data;
        const correctProfitability = profitability / 100;
        const correctInflation = inflation / 100;
        const current_term = calculation_1.default.currentTerm(term);
        const income = getCorrectCurrency(target.type.sections[0].modules, targetCurrency);
        const resourses = getCorrectCurrency(target.type.sections[4].modules, targetCurrency);
        let FV = Number(calculation_1.default.FV(income, correctInflation, current_term));
        let FVS = Number(calculation_1.default.FV(income, correctInflation, current_term));
        const FV1 = Number(calculation_1.default.FV1(resourses, correctProfitability, current_term));
        const capital = FV * 12 / correctProfitability;
        if (target.type.id === 2)
            FV = capital;
        if (combine) {
            FV = FVS = Number(target.type.sections[3].modules[0].data.fv.replace(` ${target.main.data.currency_sign}`, ''));
        }
        const percent = (FV1 / FV) * 100;
        const FV2 = FV - FV1;
        const R = (FV2 / ((Math.pow(1 + correctProfitability, current_term) - 1) / correctProfitability));
        const currentPeriod = calculation_1.default.currentPeriod(period);
        const currentMonths = calculation_1.default.currentMonths(period);
        const currentR = R / currentPeriod < 0 ? 0 : Number((R / currentPeriod).toFixed(0));
        const correctTarget = {
            id: target.id,
            number: target.id,
            name: target.main.data.name.replace(/\s{2,}/g, ' ').trim(),
            mainCurrency: targetCurrency,
            type: target.type.id,
            income,
            term: `${term.term} ${(0, correctEnd_1.default)(term)}`,
            resourses,
            riskPortfolio: getCorrectPortfolioTag(target.type.sections[5].modules[0].data.portfolio, course),
            conclusion: {
                amount: '0',
                period: getCorrectPeriod(period),
                replenishment: getCorrectCurrency(target.conclusion.sections[1].modules, targetCurrency),
                comment: getCorrectInstrumentComment(target.conclusion.sections[3].modules[0].data.comment)
            },
            chart: [],
            portfolios: (0, portfolio_1.default)(target, course, assets, FV),
            status: target.status,
            capital: '0',
            passive: '0',
            percent: '0'
        };
        correctTarget.capital = capital.toFixed(1);
        correctTarget.passive = FVS.toFixed(1);
        correctTarget.percent = percent > 100 ? '100' : percent.toFixed(1);
        correctTarget.conclusion.amount = FV2 < 0 ? '0' : FV2.toFixed(1);
        correctTarget.chart = calculation_1.default.chartFill(target.type.sections[4].modules, current_term, currentPeriod, currentMonths, correctProfitability, targetCurrency, targetCurrencySign, getCorrectCurrency, course, currentR);
        console.log('pdf done');
        targets = [...targets, correctTarget];
    });
    return targets;
};
//# sourceMappingURL=transformData.js.map