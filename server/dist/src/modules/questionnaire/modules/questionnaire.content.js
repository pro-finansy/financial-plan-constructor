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
exports.editContents = exports.fillExpertContent = void 0;
const investment_model_1 = __importDefault(require("../../investment/investment.model"));
const enums_1 = require("../../../utils/enums");
function fillInstrument(questionnareInstruments, instruments, expert) {
    const keys = [`class_one`, `class_one_id`, `country_one`, `country_one_id`, `currency_one`, `currency_one_id`, `base_currency_one`, `base_currency_one_id`, `instrument_type_one`, `instrument_type_one_id`, `section_one`, `section_one_id`];
    for (const instrument of questionnareInstruments) {
        const findInstrument = instruments.find((i) => i.name.trim() === instrument.data.name.trim());
        if (findInstrument) {
            for (const key of keys)
                instrument.data[key] = findInstrument[key];
            const comment = findInstrument.comments.find((c) => String(c._id) === String(expert));
            if (comment)
                instrument.data.comment = comment.comment;
        }
    }
}
function fillExpertContent(studentContent, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const instruments = yield investment_model_1.default.find().lean();
        studentContent.targets.data.forEach((target) => {
            for (const portfolioId in target.portfolios) {
                const portfolio = target.portfolios[portfolioId];
                if (portfolioId === 'expert')
                    break;
                if (portfolioId === 'existing') {
                    if ((portfolio.sections[1].modules.find((m) => m.data.name) || portfolio.sections[2].modules.find((m) => m.data.name)))
                        target.status.existing = 1;
                    else
                        target.status.existing = -1;
                }
                if (data.course.type === enums_1.COURSES.ONE) {
                    fillInstrument(portfolio.sections[1].modules, instruments, data.expert._id);
                    fillInstrument(portfolio.sections[2].modules, instruments, data.expert._id);
                }
            }
        });
        data.content_EXPERT = studentContent;
        data.markModified('content_EXPERT');
    });
}
exports.fillExpertContent = fillExpertContent;
;
function editContents(req, data, email) {
    req.body.content_STUDENT.student.data.module.data.email = email;
    req.body.content_STUDENT.targets.data.forEach((target) => {
        target.status.expert = 1;
        target.status.student = 1;
        if (target.portfolios.existing.sections[1].modules.find((m) => m.data.name) || target.portfolios.existing.sections[2].modules.find((m) => m.data.name)) {
            target.status.existing = 1;
        }
        else {
            target.status.existing = -1;
        }
        for (const key in target.portfolios) {
            const portfolio = target.portfolios[key];
            if (key === 'expert')
                break;
            portfolio.sections[1].modules.forEach((m) => {
                let lot = m.data.lot && data.course.type === enums_1.COURSES.TWO ? m.data.lot : 1;
                m.data.formula = Number((m.data.number_papers * m.data.price * lot).toFixed(2));
            });
            portfolio.sections[2].modules.forEach((m) => {
                let lot = m.data.lot && data.course.type === enums_1.COURSES.TWO ? m.data.lot : 1;
                m.data.formula = Number((m.data.number_papers * m.data.price * lot).toFixed(2));
            });
            const tacticSection = portfolio.sections.find((s) => s.default.includes('tactic'));
            if (tacticSection && tacticSection.modules.find((m) => m.data.name && m.data.price)) {
                tacticSection.selected = true;
            }
        }
    });
    data.content_STUDENT = req.body.content_STUDENT;
    data.seconds = 0;
    data.updatedAt = Date.now();
    data.status = enums_1.QUESTIONNAIRE_STATUSES.NOTVERIFIED;
    data.markModified("content_STUDENT");
}
exports.editContents = editContents;
;
exports.default = { editContents, fillExpertContent };
//# sourceMappingURL=questionnaire.content.js.map