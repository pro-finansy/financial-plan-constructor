"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.diskStorage({
    destination: function (_req, _file, cb) {
        cb(null, process.env.USER_IMG_FOUND);
    },
    filename: function (req, file, cb) {
        cb(null, req.query._id + '.' + file.originalname.split('.').pop());
    }
});
const upload = (0, multer_1.default)({ storage });
const user_controller_1 = __importDefault(require("./user.controller"));
const jwt_1 = __importDefault(require("../../middleware/jwt"));
const verifyRoles_1 = __importDefault(require("../../middleware/verifyRoles"));
const enums_1 = require("../../utils/enums");
router.get("/user/id/:_id", jwt_1.default, user_controller_1.default.getUser);
router.get("/user/list", jwt_1.default, (0, verifyRoles_1.default)(false, enums_1.ROLES.OWNER), user_controller_1.default.getUsers);
router.get("/user/expert/pag", jwt_1.default, (0, verifyRoles_1.default)(true, enums_1.ROLES.OWNER), user_controller_1.default.getPaginationExperts);
router.get("/user/support/pag", jwt_1.default, (0, verifyRoles_1.default)(true, enums_1.ROLES.OWNER), user_controller_1.default.getPaginationSupport);
router.get("/user/expert/list", jwt_1.default, (0, verifyRoles_1.default)(true, enums_1.ROLES.OWNER, enums_1.ROLES.EXPERT, enums_1.ROLES.SUPPORT), user_controller_1.default.getListExperts);
router.post("/user/expert", jwt_1.default, (0, verifyRoles_1.default)(true, enums_1.ROLES.OWNER), user_controller_1.default.createExpert);
router.post("/user/support", jwt_1.default, (0, verifyRoles_1.default)(true, enums_1.ROLES.OWNER), user_controller_1.default.createSupport);
router.post("/user/avatar", jwt_1.default, upload.single('avatar'), user_controller_1.default.setUserAvatar);
router.put("/user/active/:_id", jwt_1.default, (0, verifyRoles_1.default)(true, enums_1.ROLES.OWNER), user_controller_1.default.changeActive);
router.put("/user/comments", jwt_1.default, (0, verifyRoles_1.default)(true, enums_1.ROLES.OWNER, enums_1.ROLES.EXPERT), user_controller_1.default.editComments);
router.patch("/user", jwt_1.default, user_controller_1.default.updateUser);
router.patch("/user/support", jwt_1.default, (0, verifyRoles_1.default)(true, enums_1.ROLES.OWNER), user_controller_1.default.editSupport);
router.patch("/user/expert", jwt_1.default, (0, verifyRoles_1.default)(true, enums_1.ROLES.OWNER), user_controller_1.default.editExpert);
router.patch("/user/password", jwt_1.default, user_controller_1.default.changePassword);
router.delete("/user/:_id", jwt_1.default, (0, verifyRoles_1.default)(false, enums_1.ROLES.OWNER), user_controller_1.default.deleteUser);
router.delete("/user/expert/:_id", jwt_1.default, (0, verifyRoles_1.default)(false, enums_1.ROLES.OWNER), user_controller_1.default.deleteExpert);
router.delete("/user/avatar/:_id", jwt_1.default, user_controller_1.default.deleteUserAvatar);
module.exports = router;
//# sourceMappingURL=user.routes.js.map