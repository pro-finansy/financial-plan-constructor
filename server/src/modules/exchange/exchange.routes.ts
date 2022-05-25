import { Router } from "express";
const router = Router();

import controller from "./exchange.controller";
import verify from '../../middleware/jwt';

router.get("/exchanges/:search", verify, controller.gets);
router.get("/exchange/:search", verify, controller.get);

module.exports = router;
