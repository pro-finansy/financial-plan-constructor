import { Router } from "express";
const router = Router();

import controller from "./faq.controller";

import verify from '../../middleware/jwt';
import verifyRoles from "../../middleware/verifyRoles";
import { ROLES } from "../../utils/enums";

router.get("/faq/list", verify, verifyRoles(true, ROLES.OWNER, ROLES.EXPERT, ROLES.SUPPORT), controller.onGet);
router.post("/faq", verify, verifyRoles(true, ROLES.OWNER), controller.onCreate);
router.patch("/faq", verify, verifyRoles(true, ROLES.OWNER), controller.onEdit);
router.delete("/faq/:_id", verify, verifyRoles(true, ROLES.OWNER), controller.onDelete);

module.exports = router;
