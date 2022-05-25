import { Router } from "express";
const router = Router();

import controller from "./mixed.controller";

import verify from '../../middleware/jwt';
import verifyRoles from '../../middleware/verifyRoles';
import { ROLES } from '../../utils/enums';

router.get("/asset/list", verify, controller.onGetList);
router.get("/asset/pag", verify, controller.onGet);
router.post("/asset", verify, verifyRoles(true, ROLES.OWNER), controller.onPost);
router.patch("/asset", verify, verifyRoles(true, ROLES.OWNER), controller.onPatch);
router.delete("/asset/:_id", verify, verifyRoles(true, ROLES.OWNER), controller.onDelete);

module.exports = router;