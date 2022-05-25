import { Router } from "express";
const router = Router();

import controller from "./courseElement.controller";
import verify from '../../middleware/jwt';

router.get("/courseelement", verify, controller.get);
router.get("/courseelement/streams", verify, controller.streams);

module.exports = router;
