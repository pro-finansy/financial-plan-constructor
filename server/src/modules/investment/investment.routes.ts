import { Router } from "express";
const router = Router();

import controller from "./investment.controller";

import verify from '../../middleware/jwt';
import verifyRoles from "../../middleware/verifyRoles";
import { ROLES } from "../../utils/enums";

router.get("/investments", verify, controller.get);
router.get("/investments/list", verify, verifyRoles(true, ROLES.OWNER), controller.gets);

router.post("/investment", verify, verifyRoles(true, ROLES.OWNER), controller.onCreate);
router.post("/investments/unique", controller.onUnique);
router.post("/investments/actual", controller.actual);

router.patch("/investment", verify, verifyRoles(true, ROLES.OWNER), controller.onEdit);
router.patch("/investment/blocked/:_id", verify, verifyRoles(true, ROLES.OWNER), controller.onToggleBlocked);

router.delete("/investment/:_id", verify, verifyRoles(true, ROLES.OWNER), controller.onDelete);

module.exports = router;
