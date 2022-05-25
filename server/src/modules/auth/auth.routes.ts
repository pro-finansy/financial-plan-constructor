import { Router } from "express";
const router = Router();

import controller from "./auth.controller";

import rateLimit from "express-rate-limit";
import verify from '../../middleware/jwt';
import verifyRoles from '../../middleware/verifyRoles';
import { ROLES } from '../../utils/enums';

const limiterOptions = {
  ms: 1 * 60 * 1000,
  max: 6,
  message: 'Превышено количество авторизаций в минуту, повторите попытку позже!'
}

const apiLimiter = rateLimit({
  windowMs: limiterOptions.ms,
  max: limiterOptions.max,
  message: limiterOptions.message
});

router.get("/authorization", verify, controller.authentification);

router.post("/login", apiLimiter, controller.login);
router.post("/login/password", controller.loginPassword);
router.post("/logout", controller.logout);
router.post("/reset", controller.reset);
router.post("/change", verify, controller.change);
router.post("/reload", verify, verifyRoles(false, ROLES.OWNER), controller.reload);

module.exports = router;
