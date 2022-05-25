import { Router } from "express";
const router = Router();

import controller from "./analytics.controller";

import verifyRoles from "../../middleware/verifyRoles";
import verify from "../../middleware/jwt";
import { ROLES } from "../../utils/enums";

router.get("/analytics/common", verify, verifyRoles(true, ROLES.OWNER, ROLES.SUPPORT), controller.getCommon);
router.get("/analytics/common/expert", verify, verifyRoles(true, ROLES.OWNER, ROLES.SUPPORT, ROLES.EXPERT), controller.getCommonExpert);
router.get("/analytics/average", verify, verifyRoles(true, ROLES.OWNER, ROLES.SUPPORT, ROLES.EXPERT), controller.getAverage);
router.get("/analytics/experts", verify, verifyRoles(true, ROLES.OWNER, ROLES.SUPPORT, ROLES.EXPERT), controller.getExperts);

module.exports = router;
