import { Router } from "express";
const router = Router();

import controller from "./actions.controller";

import verifyRoles from "../../middleware/verifyRoles";
import verify from "../../middleware/jwt";
import { ROLES } from "../../utils/enums";

router.get("/actions", verify, verifyRoles(true, ROLES.OWNER, ROLES.SUPPORT, ROLES.EXPERT), controller.get);

module.exports = router;
