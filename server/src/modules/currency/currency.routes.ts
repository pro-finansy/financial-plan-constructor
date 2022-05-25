import { Router } from "express";
const router = Router();

import controller from "./currency.controller";
import verify from '../../middleware/jwt';
import verifyRoles from "../../middleware/verifyRoles";
import { ROLES } from "../../utils/enums";

router.get("/currency/list", verify, controller.onGet);
router.get("/currency/pag", verify, verifyRoles(true, ROLES.OWNER), controller.onGets);
router.post("/currency", verify, verifyRoles(true, ROLES.OWNER), controller.onPost);
router.patch("/currency", verify, verifyRoles(true, ROLES.OWNER), controller.onPatch);
router.delete("/currency/:_id", verify, verifyRoles(true, ROLES.OWNER), controller.onDelete);

module.exports = router;
