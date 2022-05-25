import { Router } from "express";
const router = Router();

import controller from "./excel.controller";

import verify from '../../middleware/jwt';
import verifyRoles from "../../middleware/verifyRoles";
import { ROLES } from "../../utils/enums";

import multer from 'multer';
const upload = multer({storage: multer.memoryStorage()});

router.post("/excel/questionnaires", verify, controller.createQuestionnaireExcel);
router.post("/excel/instruments", verify, controller.createInstrumentsExcel);
router.post("/excel/students/download", verify, controller.downloadStudents);
router.patch("/excel/students", verify, verifyRoles(true, ROLES.OWNER, ROLES.SUPPORT, ROLES.ADMIN), upload.single('excel'), controller.importStudentList);
// router.post("/excel/student/file", verify, controller.createStudentFile);

module.exports = router;
