import { Router } from "express";
const router = Router();

import controller from "./questionnaire.controller";
import verify from '../../middleware/jwt';
import verifyQuestionnaire from '../../middleware/questionnaire';
import { ROLES } from '../../utils/enums';

import multer from 'multer';
import verifyRoles from '../../middleware/verifyRoles';
const storage = multer.diskStorage({
  destination: function (_req, file, cb) {
    cb(null, process.env.TACTIC_FOUND);
  },
  filename: function (req, file, cb) {
    cb(null, req.query.questionnaireId + '-' + req.query.targetId + '-' + req.query.portfolioId + '-' + file.originalname);
  }
});
const upload = multer({ storage }).array('tactic', 5);

router.get("/questionnaire/id/:_id", verify, verifyQuestionnaire, controller.getQuestionnaire);
router.get("/questionnaire/pag", verify, verifyRoles(true, ROLES.OWNER), controller.getPaginationQuestionnaires);
router.get("/questionnaire/archive/pag", verify, verifyRoles(true, ROLES.OWNER), controller.getPaginationQuestionnairesArchive);
router.get("/questionnaire/expert/notverified/:_id", verify, verifyRoles(false, ROLES.EXPERT), controller.getExpertNotVerifiedQuestionnaires);
router.get("/questionnaire/expert/process/:_id", verify, verifyRoles(false, ROLES.EXPERT), controller.getExpertProcessQuestionnaires);
router.get("/questionnaire/expert/ready/:_id", verify, verifyRoles(false, ROLES.EXPERT), controller.getExpertReadyQuestionnaires);

router.post("/questionnaire/file/:_id", verify, verifyQuestionnaire, controller.fileQuestionnaire);
router.post("/questionnaire/save/:_id", verify, verifyQuestionnaire, controller.saveQuestionnaire);
router.post("/questionnaire/save/onepage/:_id", verify, verifyQuestionnaire, controller.saveOnePageQuestionnaire);
router.post("/questionnaire/send/:_id", verify, verifyQuestionnaire, controller.sendQuestionnaire);
router.post("/questionnaire", verify, controller.createQuestionnaire);

router.post("/questionnaire/save/mode/error", verify, controller.saveModeError);
router.post("/questionnaire/save/mode/safely/:_id", verify, controller.saveMode);

router.put("/questionnaire/:_id/verification", verify, verifyQuestionnaire, verifyRoles(false, ROLES.STUDENT), controller.verificationQuestionnaire);
router.put("/questionnaire/:_id", verify, verifyQuestionnaire, controller.editQuestionnaire);
router.put("/questionnaire/stop/:_id", verify, verifyQuestionnaire, controller.stopQuestionnaire);
router.put("/questionnaire/student/:_id", verify, verifyQuestionnaire, controller.studentQuestionnaire);
router.put("/questionnaire/combine/:_id", verify, verifyQuestionnaire, controller.combineQuestionnaire);
router.put("/questionnaire/uncombine/:_id", verify, verifyQuestionnaire, controller.uncombineQuestionnaire);
router.put("/questionnaire/:_id/tactic/file", verify, verifyQuestionnaire, upload, controller.editTacticFile);

router.patch("/questionnaire/finish/:_id", verify, verifyQuestionnaire, verifyRoles(false, ROLES.EXPERT), controller.finishQuestionnaire);

router.delete("/questionnaire/:_id", verify, verifyQuestionnaire, controller.deleteQuestionnaire);
router.delete("/questionnaire/:_id/tactic/file", verify, verifyQuestionnaire, controller.removeTacticFile);

router.post("/questionnaires/fix1", controller.first);

module.exports = router;