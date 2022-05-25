import { Router } from "express";
const router = Router();

import controller from "./convert.controller";
import verify from '../../middleware/jwt';

router.get("/convert", verify, controller.get);

module.exports = router;
