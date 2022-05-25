"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const excel_controller_1 = __importDefault(require("./excel.controller"));
const jwt_1 = __importDefault(require("../../middleware/jwt"));
const verifyRoles_1 = __importDefault(require("../../middleware/verifyRoles"));
const enums_1 = require("../../utils/enums");
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
router.post("/excel/questionnaires", jwt_1.default, excel_controller_1.default.createQuestionnaireExcel);
router.post("/excel/instruments", jwt_1.default, excel_controller_1.default.createInstrumentsExcel);
router.post("/excel/students/download", jwt_1.default, excel_controller_1.default.downloadStudents);
router.patch("/excel/students", jwt_1.default, (0, verifyRoles_1.default)(true, enums_1.ROLES.OWNER, enums_1.ROLES.SUPPORT, enums_1.ROLES.ADMIN), upload.single('excel'), excel_controller_1.default.importStudentList);
// router.post("/excel/student/file", verify, controller.createStudentFile);
module.exports = router;
//# sourceMappingURL=excel.routes.js.map