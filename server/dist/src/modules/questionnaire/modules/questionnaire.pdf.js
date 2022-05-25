"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.createQuestionnairePDF = exports.collectionDataPDF = void 0;
const axios_1 = __importDefault(require("axios"));
const html_pdf_1 = __importDefault(require("html-pdf"));
const ejs_1 = __importDefault(require("ejs"));
const fs_1 = __importDefault(require("fs"));
const questionnaire_controller_1 = require("../questionnaire.controller");
const response_1 = require("../../../utils/response");
const enums_1 = require("../../../utils/enums");
const transformData_1 = __importStar(require("../templates/modules/transformData"));
const common_1 = require("../templates/modules/common");
const correctEnd_1 = __importDefault(require("../templates/modules/correctEnd"));
const questionnaire_constants_1 = __importDefault(require("../questionnaire.constants"));
function collectionDataPDF(questionnaire) {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
exports.collectionDataPDF = collectionDataPDF;
function createQuestionnairePDF(req, res, questionnaire, assets, collection, onresponse, onepage) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = {
            format: "A4",
            orientation: "portrait",
            renderDelay: 2000,
            height: '802px',
            border: {
                top: '20px',
                bottom: '20px'
            }
        };
        const combine = !!questionnaire.content_COMBINE_EXPERT;
        const course = questionnaire.course.type;
        const targets = (0, transformData_1.default)(questionnaire.content_EXPERT, course, assets);
        const student = questionnaire.content_EXPERT.student.data.module.data;
        const comment = (0, transformData_1.getCorrectInstrumentComment)(questionnaire.content_EXPERT.comment.data.module.data.comment);
        const expert = questionnaire.expert;
        const days = (0, correctEnd_1.default)({ term: expert.dayLength, duration_id: 'DAYS' });
        const info = course === enums_1.COURSES.ONE ? common_1.firstQuestionnaireInfo : common_1.secondQuestionnaireInfo;
        const header = (0, common_1.base64_encode)(questionnaire_constants_1.default.SRC_HEADER);
        const data = { days, targets, student, comment, expert, onepage, course, combine, info, header,
            avatar: expert.avatar ? (0, common_1.base64_encode)(__dirname + "/../../../../public/" + expert.avatar.src) : "",
        };
        try {
            const html = yield ejs_1.default.renderFile(questionnaire_constants_1.default.SRC_QUESTIONNAIRE_TEMPLATE(course), data);
            if (onepage) {
                const result = yield axios_1.default
                    .post(`http://${process.env.LIVE_IP}:5555/pdf`, { html, filename: 'pdfcreate' }, { responseType: 'arraybuffer' });
                fs_1.default.writeFileSync(questionnaire_constants_1.default.SRC_QUESTIONNAIRE_OUTPUT_ONEPAGE(questionnaire._id), result.data, 'binary');
                const email = questionnaire.student ? questionnaire.student.email : questionnaire.content_EXPERT.student.data.module.data.email;
                (0, response_1.response)(res, enums_1.STATUSES.OK, true, questionnaire_constants_1.default.COLLECTED_SUCCESS_ONEPAGE, { src: `/upload/files/${questionnaire._id}_onepage.pdf`, name: `${email || 'Отчет'}.pdf` });
            }
            else {
                html_pdf_1.default.create(html, options).toFile(questionnaire_constants_1.default.SRC_QUESTIONNAIRE_OUTPUT(questionnaire._id), (err) => __awaiter(this, void 0, void 0, function* () {
                    if (err)
                        return console.log(err);
                    if (collection) {
                        res.locals.questionnaire = questionnaire;
                        res.locals.fileData = { src: `/upload/files/${questionnaire._id}.pdf`, name: `${questionnaire._id}.pdf` };
                        yield (0, questionnaire_controller_1.createQuestionnaireFile)(req, res);
                        if (!onresponse)
                            return;
                        return (0, response_1.response)(res, enums_1.STATUSES.OK, true, questionnaire_constants_1.default.COLLECTED_SUCCESS);
                    }
                    else {
                        const email = questionnaire.student ? questionnaire.student.email : questionnaire.content_EXPERT.student.data.module.data.email;
                        return (0, response_1.response)(res, enums_1.STATUSES.OK, true, questionnaire_constants_1.default.COLLECTED_SUCCESS, { src: `/upload/files/${questionnaire._id}.pdf`, name: `${email || 'Отчет'}.pdf` });
                    }
                }));
            }
        }
        catch (err) {
            (0, response_1.response)(res, enums_1.STATUSES.CONFLICT, false, 'При генерации PDF-файла произошла ошибка');
        }
    });
}
exports.createQuestionnairePDF = createQuestionnairePDF;
exports.default = { createQuestionnairePDF };
//# sourceMappingURL=questionnaire.pdf.js.map