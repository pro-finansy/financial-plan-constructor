"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const questionnaire_controller_1 = __importDefault(require("./questionnaire.controller"));
const jwt_1 = __importDefault(require("../../middleware/jwt"));
const questionnaire_1 = __importDefault(require("../../middleware/questionnaire"));
const enums_1 = require("../../utils/enums");
const multer_1 = __importDefault(require("multer"));
const verifyRoles_1 = __importDefault(require("../../middleware/verifyRoles"));
const storage = multer_1.default.diskStorage({
    destination: function (_req, file, cb) {
        cb(null, process.env.TACTIC_FOUND);
    },
    filename: function (req, file, cb) {
        cb(null, req.query.questionnaireId + '-' + req.query.targetId + '-' + req.query.portfolioId + '-' + file.originalname);
    }
});
const upload = (0, multer_1.default)({ storage }).array('tactic', 5);
router.get("/questionnaire/id/:_id", jwt_1.default, questionnaire_1.default, questionnaire_controller_1.default.getQuestionnaire);
router.get("/questionnaire/pag", jwt_1.default, (0, verifyRoles_1.default)(true, enums_1.ROLES.OWNER), questionnaire_controller_1.default.getPaginationQuestionnaires);
router.get("/questionnaire/archive/pag", jwt_1.default, (0, verifyRoles_1.default)(true, enums_1.ROLES.OWNER), questionnaire_controller_1.default.getPaginationQuestionnairesArchive);
router.get("/questionnaire/expert/notverified/:_id", jwt_1.default, (0, verifyRoles_1.default)(false, enums_1.ROLES.EXPERT), questionnaire_controller_1.default.getExpertNotVerifiedQuestionnaires);
router.get("/questionnaire/expert/process/:_id", jwt_1.default, (0, verifyRoles_1.default)(false, enums_1.ROLES.EXPERT), questionnaire_controller_1.default.getExpertProcessQuestionnaires);
router.get("/questionnaire/expert/ready/:_id", jwt_1.default, (0, verifyRoles_1.default)(false, enums_1.ROLES.EXPERT), questionnaire_controller_1.default.getExpertReadyQuestionnaires);
router.post("/questionnaire/file/:_id", jwt_1.default, questionnaire_1.default, questionnaire_controller_1.default.fileQuestionnaire);
router.post("/questionnaire/save/:_id", jwt_1.default, questionnaire_1.default, questionnaire_controller_1.default.saveQuestionnaire);
router.post("/questionnaire/save/onepage/:_id", jwt_1.default, questionnaire_1.default, questionnaire_controller_1.default.saveOnePageQuestionnaire);
router.post("/questionnaire/send/:_id", jwt_1.default, questionnaire_1.default, questionnaire_controller_1.default.sendQuestionnaire);
router.post("/questionnaire", jwt_1.default, questionnaire_controller_1.default.createQuestionnaire);
router.post("/questionnaire/save/mode/error", jwt_1.default, questionnaire_controller_1.default.saveModeError);
router.post("/questionnaire/save/mode/safely/:_id", jwt_1.default, questionnaire_controller_1.default.saveMode);
router.put("/questionnaire/:_id/verification", jwt_1.default, questionnaire_1.default, (0, verifyRoles_1.default)(false, enums_1.ROLES.STUDENT), questionnaire_controller_1.default.verificationQuestionnaire);
router.put("/questionnaire/:_id", jwt_1.default, questionnaire_1.default, questionnaire_controller_1.default.editQuestionnaire);
router.put("/questionnaire/stop/:_id", jwt_1.default, questionnaire_1.default, questionnaire_controller_1.default.stopQuestionnaire);
router.put("/questionnaire/student/:_id", jwt_1.default, questionnaire_1.default, questionnaire_controller_1.default.studentQuestionnaire);
router.put("/questionnaire/combine/:_id", jwt_1.default, questionnaire_1.default, questionnaire_controller_1.default.combineQuestionnaire);
router.put("/questionnaire/uncombine/:_id", jwt_1.default, questionnaire_1.default, questionnaire_controller_1.default.uncombineQuestionnaire);
router.put("/questionnaire/:_id/tactic/file", jwt_1.default, questionnaire_1.default, upload, questionnaire_controller_1.default.editTacticFile);
router.patch("/questionnaire/finish/:_id", jwt_1.default, questionnaire_1.default, (0, verifyRoles_1.default)(false, enums_1.ROLES.EXPERT), questionnaire_controller_1.default.finishQuestionnaire);
router.delete("/questionnaire/:_id", jwt_1.default, questionnaire_1.default, questionnaire_controller_1.default.deleteQuestionnaire);
router.delete("/questionnaire/:_id/tactic/file", jwt_1.default, questionnaire_1.default, questionnaire_controller_1.default.removeTacticFile);
router.post("/questionnaires/fix1", questionnaire_controller_1.default.first);
module.exports = router;
//# sourceMappingURL=questionnaire.routes.js.map