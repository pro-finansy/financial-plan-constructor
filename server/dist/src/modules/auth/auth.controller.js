"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reload = exports.change = exports.reset = exports.logout = exports.loginPassword = exports.login = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../user/user.model"));
const handler_1 = __importDefault(require("../../utils/handler"));
const index_1 = __importDefault(require("../email/index"));
const response_1 = require("../../utils/response");
const password_1 = require("../../utils/password");
const enums_1 = require("../../utils/enums");
const password_2 = require("../../utils/password");
const socket_1 = require("../../utils/socket");
const auth_constants_1 = __importDefault(require("./auth.constants"));
const errorLogin = (res) => (0, response_1.response)(res, enums_1.STATUSES.CONFLICT, false, auth_constants_1.default.WRONG_LOGIN);
const createToken = (user, duration) => jsonwebtoken_1.default.sign({ _id: user._id, email: user.email, role: user.role, accesses: user.accesses }, process.env.JWT_KEY || '', { expiresIn: duration });
const login = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!req.body.email)
                return (0, response_1.response)(res, enums_1.STATUSES.NOT_FOUND, false, auth_constants_1.default.NOT_EMAIL);
            const user = yield user_model_1.default.findOne({ email: req.body.email.toLowerCase().trim() })
                .populate('course')
                .populate('avatar');
            if (!user)
                return errorLogin(res);
            if (!user.password)
                return (0, response_1.response)(res, enums_1.STATUSES.FORBIDDEN, false, auth_constants_1.default.PASSWORD_NULL);
            const passwordResult = (0, password_2.check)(req.body.password, user.password);
            if (!passwordResult)
                return errorLogin(res);
            if (!user.active)
                return (0, response_1.response)(res, enums_1.STATUSES.FORBIDDEN, false, auth_constants_1.default.DEACTIVE);
            user.token = createToken(user, '7d');
            yield user.save();
            (0, response_1.response)(res, enums_1.STATUSES.OK, true, null, user);
        }
        catch (err) {
            console.log(err);
            (0, handler_1.default)(res, err);
        }
    });
};
exports.login = login;
const loginPassword = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!req.body.email)
                return (0, response_1.response)(res, enums_1.STATUSES.CONFLICT, false, auth_constants_1.default.ERR_INPUT_EMAIL);
            const user = yield user_model_1.default.findOne({ email: req.body.email.toLowerCase().trim() });
            if (!user)
                return (0, response_1.response)(res, enums_1.STATUSES.NOT_FOUND, false, auth_constants_1.default.NOT_EXIST_USER);
            if (!user.active)
                return (0, response_1.response)(res, enums_1.STATUSES.FORBIDDEN, false, auth_constants_1.default.DEACTIVE);
            if (user.password)
                return (0, response_1.response)(res, enums_1.STATUSES.CONFLICT, false, auth_constants_1.default.PASSWORD_IS);
            user.reset = createToken(user, '30m');
            yield user.save();
            (0, index_1.default)(auth_constants_1.default.SRC_LOGIN_PASSWORD, { link: process.env.LIVE_URL + `/new/${user.reset}` }, user.email, auth_constants_1.default.TITLE_LOGIN_PASSWORD);
            (0, response_1.response)(res, enums_1.STATUSES.OK, true, auth_constants_1.default.SENDED_EMAIL_REGISTER);
        }
        catch (err) {
            (0, handler_1.default)(res, err);
        }
    });
};
exports.loginPassword = loginPassword;
const authentification = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield user_model_1.default.findById(res.locals.user._id)
            .populate('avatar')
            .populate('course')
            .select('name _id token email role phone course courses accesses avatar comments');
        if (!user)
            return (0, response_1.response)(res, enums_1.STATUSES.CONFLICT, false, null);
        (0, response_1.response)(res, enums_1.STATUSES.OK, true, null, user);
    });
};
const logout = function (_req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            res.redirect('/auth');
        }
        catch (err) {
            (0, handler_1.default)(res, err);
        }
    });
};
exports.logout = logout;
const reset = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!req.body.email)
                return (0, response_1.response)(res, enums_1.STATUSES.CONFLICT, false, auth_constants_1.default.NOT_EMAIL);
            const user = yield user_model_1.default.findOne({ email: req.body.email.toLowerCase().trim() });
            if (!user)
                return (0, response_1.response)(res, enums_1.STATUSES.NOT_FOUND, false, auth_constants_1.default.NOT_FOUND);
            if (!user.active)
                return (0, response_1.response)(res, enums_1.STATUSES.FORBIDDEN, false, auth_constants_1.default.DEACTIVE);
            user.reset = createToken(user, '30m');
            yield user.save();
            (0, index_1.default)(auth_constants_1.default.SRC_RESET, { link: process.env.LIVE_URL + `/reset/${user.reset}` }, user.email, auth_constants_1.default.TITLE_RESET);
            (0, response_1.response)(res, enums_1.STATUSES.OK, true, auth_constants_1.default.SENDED_EMAIL_RESET);
        }
        catch (err) {
            (0, handler_1.default)(res, err);
        }
    });
};
exports.reset = reset;
const change = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (req.body.password !== req.body.resetPassword)
                return (0, response_1.response)(res, enums_1.STATUSES.CONFLICT, false, auth_constants_1.default.PASSWORD_CONFLICT);
            const user = yield user_model_1.default.findById(res.locals.user._id);
            if (!user)
                return (0, response_1.response)(res, enums_1.STATUSES.NOT_FOUND, false, auth_constants_1.default.NOT_FOUND);
            user.password = (0, password_1.create)(req.body.password);
            socket_1.Socket.userAction('logout', user._id);
            yield user.save();
            (0, response_1.response)(res, enums_1.STATUSES.OK, true, auth_constants_1.default.PASSWORD_EDITED);
        }
        catch (err) {
            (0, handler_1.default)(res, err);
        }
    });
};
exports.change = change;
const reload = function (_req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            socket_1.Socket.reload();
            (0, response_1.response)(res, enums_1.STATUSES.OK, true, null);
        }
        catch (err) {
            (0, handler_1.default)(res, err);
        }
    });
};
exports.reload = reload;
exports.default = { authentification, login: exports.login, loginPassword: exports.loginPassword, logout: exports.logout, reset: exports.reset, change: exports.change, reload: exports.reload };
//# sourceMappingURL=auth.controller.js.map