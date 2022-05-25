import { Router } from "express";
const router = Router();

import multer from 'multer';
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, process.env.USER_IMG_FOUND);
  },
  filename: function (req, file, cb) {
    cb(null, req.query._id + '.' + file.originalname.split('.').pop());
  }
});
const upload = multer({ storage });

import controller from "./user.controller";
import verify from '../../middleware/jwt';
import verifyRoles from '../../middleware/verifyRoles';
import { ROLES } from '../../utils/enums';

router.get("/user/id/:_id", verify, controller.getUser);
router.get("/user/list", verify, verifyRoles(false, ROLES.OWNER), controller.getUsers);
router.get("/user/expert/pag", verify, verifyRoles(true, ROLES.OWNER), controller.getPaginationExperts);
router.get("/user/support/pag", verify, verifyRoles(true, ROLES.OWNER), controller.getPaginationSupport);
router.get("/user/expert/list", verify, verifyRoles(true, ROLES.OWNER, ROLES.EXPERT, ROLES.SUPPORT), controller.getListExperts);

router.post("/user/expert", verify, verifyRoles(true, ROLES.OWNER), controller.createExpert);
router.post("/user/support", verify, verifyRoles(true, ROLES.OWNER), controller.createSupport);
router.post("/user/avatar", verify, upload.single('avatar'), controller.setUserAvatar);

router.put("/user/active/:_id", verify, verifyRoles(true, ROLES.OWNER), controller.changeActive);
router.put("/user/comments", verify, verifyRoles(true, ROLES.OWNER, ROLES.EXPERT), controller.editComments);

router.patch("/user", verify, controller.updateUser);
router.patch("/user/support", verify, verifyRoles(true, ROLES.OWNER), controller.editSupport);
router.patch("/user/expert", verify, verifyRoles(true, ROLES.OWNER), controller.editExpert);
router.patch("/user/password", verify, controller.changePassword);

router.delete("/user/:_id", verify, verifyRoles(false, ROLES.OWNER), controller.deleteUser);
router.delete("/user/expert/:_id", verify, verifyRoles(false, ROLES.OWNER), controller.deleteExpert);
router.delete("/user/avatar/:_id", verify, controller.deleteUserAvatar);

module.exports = router;
