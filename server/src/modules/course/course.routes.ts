import { Router } from "express";
const router = Router();

import controller from "./course.controller";
import verify from '../../middleware/jwt';
import verifyRoles from "../../middleware/verifyRoles";
import { ROLES } from "../../utils/enums";

router.get("/courses", verify, controller.get);
router.get("/course/list", verify, controller.list);

router.post("/course/stream", verify, verifyRoles(true, ROLES.OWNER, ROLES.SUPPORT), controller.addStreamDate);

router.patch("/course", verify, controller.patch);

module.exports = router;
