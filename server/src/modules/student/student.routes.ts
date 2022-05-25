import { Router } from "express";
const router = Router();

import controller from "./student.controller";

import verify from '../../middleware/jwt';
import verifyRoles from "../../middleware/verifyRoles";
import { ROLES } from "../../utils/enums";

import multer from 'multer';
const upload = multer({storage: multer.memoryStorage()});

router.get("/student/list", verify, verifyRoles(true, ROLES.OWNER, ROLES.SUPPORT, ROLES.EXPERT), controller.getStudentList);
router.get("/student/questionnaires", verify, controller.getStudentQuestionnaires);
router.get("/student/course/:_id", verify, controller.getCourseElement);

router.post("/student/file/download", verify, controller.downloadStudentFile);
router.post("/expert/file/download", verify, verifyRoles(true, ROLES.OWNER, ROLES.SUPPORT), controller.downloadExpertFile);
router.post("/student", verify, verifyRoles(true, ROLES.OWNER, ROLES.SUPPORT), controller.createStudent);

router.patch("/student", verify, verifyRoles(true, ROLES.OWNER, ROLES.SUPPORT), controller.changeStudent);
router.patch("/student/expert", verify, verifyRoles(true, ROLES.OWNER, ROLES.SUPPORT), controller.changeExpert);
router.patch("/student/expert/change", verify, verifyRoles(true, ROLES.OWNER, ROLES.SUPPORT), controller.changeExpertStudents);
router.patch("/student/expert/change/list", verify, verifyRoles(true, ROLES.OWNER, ROLES.SUPPORT), upload.single('excel'), controller.changeExpertListStudents);
router.patch("/student/stream", verify, verifyRoles(true, ROLES.OWNER, ROLES.SUPPORT), controller.changeStreamDate);
router.patch("/student/password", verify, verifyRoles(true, ROLES.OWNER, ROLES.SUPPORT), controller.changePassword);
router.patch("/student/delete/list", verify, verifyRoles(true, ROLES.OWNER, ROLES.SUPPORT), upload.single('excel'), controller.deleteStudents);

router.delete("/student/:_id", verify, verifyRoles(true, ROLES.OWNER, ROLES.SUPPORT), controller.deleteStudent);
router.delete("/student/file/:_id", verify, verifyRoles(true, ROLES.OWNER, ROLES.SUPPORT), controller.deleteStudentFile);

module.exports = router;