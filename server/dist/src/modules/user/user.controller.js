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
exports.deleteUserAvatar = exports.deleteExpert = exports.deleteUser = exports.editSupport = exports.editExpert = exports.changePassword = exports.updateUser = exports.editComments = exports.changeActive = exports.setUserAvatar = exports.createSupport = exports.createExpert = exports.getListExperts = exports.getPaginationSupport = exports.getPaginationExperts = exports.getUsers = exports.getUser = void 0;
const fs_1 = __importDefault(require("fs"));
const user_model_1 = __importDefault(require("./user.model"));
const files_model_1 = __importDefault(require("../files/files.model"));
const course_model_1 = __importDefault(require("../course/course.model"));
const questionnaire_model_1 = __importDefault(require("../questionnaire/questionnaire.model"));
const courseElement_model_1 = __importDefault(require("../courseElement/courseElement.model"));
const socket_1 = require("../../utils/socket");
const index_1 = __importDefault(require("../email/index"));
const response_1 = require("../../utils/response");
const password_1 = require("../../utils/password");
const enums_1 = require("../../utils/enums");
const handler_1 = __importDefault(require("../../utils/handler"));
const user_constants_1 = __importDefault(require("./user.constants"));
const defines_1 = require("../../utils/defines");
const isEmail_1 = __importDefault(require("validator/lib/isEmail"));
const actions_controller_1 = require("../actions/actions.controller");
const getUser = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield user_model_1.default.findById(req.params._id)
                .populate('avatar')
                .select('-password -token -reset')
                .lean();
            if (!data)
                return (0, response_1.response)(res, enums_1.STATUSES.NOT_FOUND, false, user_constants_1.default.NOT_FOUND);
            (0, response_1.response)(res, enums_1.STATUSES.OK, true, null, data);
        }
        catch (err) {
            (0, handler_1.default)(res, err);
        }
    });
};
exports.getUser = getUser;
const getUsers = function (_req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield user_model_1.default.find()
                .populate('avatar')
                .select('-password -token -reset')
                .lean();
            const total = yield user_model_1.default.countDocuments();
            (0, response_1.getsResponse)(res, enums_1.STATUSES.OK, true, null, data, total);
        }
        catch (err) {
            (0, handler_1.default)(res, err);
        }
    });
};
exports.getUsers = getUsers;
const getPaginationExperts = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const filters = {};
            (0, defines_1.definePagination)(filters, req.query);
            const query = { role: enums_1.ROLES.EXPERT };
            const search = String(req.query.search);
            const cyrrilic = search.trim().match("[а-яА-Я\s]+$");
            const latin = search.trim().match("^[a-zA-Z0-9_.-]+$");
            const email = (0, isEmail_1.default)(search.trim());
            if (latin || email)
                query.email = { '$regex': search, '$options': 'i' };
            if (cyrrilic)
                query.name = { '$regex': search, '$options': 'i' };
            const data = yield user_model_1.default.find(query, {}, filters)
                .populate('avatar')
                .select('-password -token -reset')
                .lean();
            const total = yield user_model_1.default.countDocuments(query);
            (0, response_1.getsResponse)(res, enums_1.STATUSES.OK, true, null, data, total);
        }
        catch (err) {
            (0, handler_1.default)(res, err);
        }
    });
};
exports.getPaginationExperts = getPaginationExperts;
const getPaginationSupport = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const filters = {};
            (0, defines_1.definePagination)(filters, req.query);
            const query = { role: enums_1.ROLES.SUPPORT };
            const search = String(req.query.search);
            const cyrrilic = search.trim().match("[а-яА-Я\s]+$");
            const latin = search.trim().match("^[a-zA-Z0-9_.-]+$");
            const email = (0, isEmail_1.default)(search.trim());
            if (latin || email)
                query.email = { '$regex': search, '$options': 'i' };
            if (cyrrilic)
                query.name = { '$regex': search, '$options': 'i' };
            const data = yield user_model_1.default.find(query, {}, filters)
                .populate('avatar')
                .select('-password -token -reset')
                .lean();
            const total = yield user_model_1.default.countDocuments(query);
            (0, response_1.getsResponse)(res, enums_1.STATUSES.OK, true, null, data, total);
        }
        catch (err) {
            (0, handler_1.default)(res, err);
        }
    });
};
exports.getPaginationSupport = getPaginationSupport;
const getListExperts = function (_req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield user_model_1.default.find({ role: enums_1.ROLES.EXPERT })
                .select('name _id course')
                .lean();
            (0, response_1.getsResponse)(res, enums_1.STATUSES.OK, true, null, data);
        }
        catch (err) {
            (0, handler_1.default)(res, err);
        }
    });
};
exports.getListExperts = getListExperts;
const createExpert = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const courses = yield course_model_1.default.find().lean();
            const candidate = yield user_model_1.default.findOne({ email: req.body.email });
            if (candidate)
                return (0, response_1.response)(res, enums_1.STATUSES.CONFLICT, false, user_constants_1.default.EMAIL_EXISTS);
            const password = req.body.password;
            req.body.password = (0, password_1.create)(req.body.password);
            req.body.role = enums_1.ROLES.EXPERT;
            req.body.accesses = req.body.accesses_id;
            delete req.body.avatar;
            if (req.body.accesses.indexOf(enums_1.ACCESSES.HOMEWORK) !== -1) {
                req.body.course = courses.find((c) => c.tag === enums_1.ACCESSES.HOMEWORK);
            }
            else if (req.body.accesses.indexOf(enums_1.ACCESSES.INVESTMENT) !== -1) {
                req.body.course = courses.find((c) => c.tag === enums_1.ACCESSES.INVESTMENT);
            }
            const data = new user_model_1.default(req.body);
            yield data.save();
            (0, actions_controller_1.createAction)(res.locals.user._id, `Создание аккаунта эксперта - ${req.body.name}`, 'EXPERT_CREATE');
            (0, index_1.default)(__dirname + '/templates/role.html', { role: 'Эксперта', email: req.body.email, password: password }, req.body.email, user_constants_1.default.TITLE_EXPERT_CREATE_ACCOUNT);
            (0, response_1.response)(res, enums_1.STATUSES.CREATED, true, user_constants_1.default.EXPERT_CREATE, data);
        }
        catch (err) {
            (0, handler_1.default)(res, err);
        }
    });
};
exports.createExpert = createExpert;
const createSupport = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const candidate = yield user_model_1.default.findOne({ email: req.body.email.toLowerCase().trim() });
            if (candidate)
                return (0, response_1.response)(res, enums_1.STATUSES.CONFLICT, false, user_constants_1.default.EMAIL_EXISTS);
            req.body.email = req.body.email.toLowerCase().trim();
            const password = req.body.password;
            req.body.password = (0, password_1.create)(req.body.password);
            req.body.role = enums_1.ROLES.SUPPORT;
            delete req.body.avatar;
            const data = new user_model_1.default(req.body);
            yield data.save();
            (0, actions_controller_1.createAction)(res.locals.user._id, `Создание аккаунта службы поддержки - ${req.body.name}`, 'SUPPORT_CREATE');
            (0, index_1.default)(__dirname + '/templates/role.html', { role: 'Службы поддержки', email: req.body.email, password: password }, req.body.email, user_constants_1.default.TITLE_SUPPORT_CREATE_ACCOUNT);
            (0, response_1.response)(res, enums_1.STATUSES.CREATED, true, user_constants_1.default.SUPPORT_CREATE, data);
        }
        catch (err) {
            (0, handler_1.default)(res, err);
        }
    });
};
exports.createSupport = createSupport;
const setUserAvatar = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield user_model_1.default.findById(req.query._id);
            let avatar = yield files_model_1.default.findById(data.avatar);
            if (!data)
                return (0, response_1.response)(res, enums_1.STATUSES.NOT_FOUND, false, user_constants_1.default.NOT_FOUND);
            if (!req.file)
                return (0, response_1.response)(res, enums_1.STATUSES.NOT_FOUND, false, user_constants_1.default.NOT_FOUND_FILE);
            const src = `/upload/users/${data._id}.${req.file.originalname.split('.').pop()}`;
            if (!avatar) {
                avatar = new files_model_1.default({
                    type: enums_1.FILES.AVATAR,
                    src
                });
                data.avatar = avatar._id;
                yield data.save();
            }
            else {
                avatar.src = src;
            }
            yield avatar.save();
            (0, response_1.response)(res, enums_1.STATUSES.OK, true, null, { avatar });
        }
        catch (err) {
            console.log(err);
            (0, handler_1.default)(res, err);
        }
    });
};
exports.setUserAvatar = setUserAvatar;
const changeActive = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let data = yield user_model_1.default.findById(req.params._id);
            if (!data)
                return (0, response_1.response)(res, enums_1.STATUSES.NOT_FOUND, false, user_constants_1.default.NOT_FOUND);
            if (!req.body.active) {
                socket_1.Socket.userAction('logout', req.params._id);
                data.token = null;
                data.reset = null;
            }
            data.active = req.body.active;
            yield data.save();
            const status = req.body.active ? 'Активация' : 'Деактивация';
            (0, actions_controller_1.createAction)(res.locals.user._id, `${status} аккаунта пользователя - ${data.name} (${data.email})`, 'ACTIVE_USER');
            (0, response_1.response)(res, enums_1.STATUSES.OK, true, null, data);
        }
        catch (err) {
            (0, handler_1.default)(res, err);
        }
    });
};
exports.changeActive = changeActive;
const editComments = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let data = yield user_model_1.default.findById(res.locals.user._id)
                .populate('course')
                .populate('avatar');
            if (!data)
                return (0, response_1.response)(res, enums_1.STATUSES.NOT_FOUND, false, user_constants_1.default.NOT_FOUND);
            data.comments = req.body.comments;
            data.markModified('comments');
            yield data.save();
            (0, response_1.response)(res, enums_1.STATUSES.OK, true, user_constants_1.default.SAVE_COMMENTS, data);
        }
        catch (err) {
            (0, handler_1.default)(res, err);
        }
    });
};
exports.editComments = editComments;
const updateUser = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield user_model_1.default.findById(res.locals.user._id)
                .populate('avatar')
                .populate('course')
                .select('-password -reset');
            if (!data)
                return (0, response_1.response)(res, enums_1.STATUSES.NOT_FOUND, false, user_constants_1.default.NOT_FOUND);
            if (req.body.password && req.body.password !== req.body.reset_password)
                return (0, response_1.response)(res, enums_1.STATUSES.CONFLICT, false, user_constants_1.default.ERR_COINCIDENCE_PASSWORD);
            if (req.body.password && req.body.password.length < 6)
                return (0, response_1.response)(res, enums_1.STATUSES.CONFLICT, false, user_constants_1.default.ERR_MIN_PASSWORD);
            if (req.body.password) {
                req.body.password = (0, password_1.create)(req.body.password);
            }
            else {
                delete req.body.password;
            }
            for (const key in req.body) {
                if (req.body.hasOwnProperty(key))
                    data[key] = req.body[key];
            }
            yield data.save();
            (0, response_1.response)(res, enums_1.STATUSES.OK, true, user_constants_1.default.UPDATE_USER, data);
        }
        catch (err) {
            (0, handler_1.default)(res, err);
        }
    });
};
exports.updateUser = updateUser;
const changePassword = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!req.body.password)
                return (0, response_1.response)(res, enums_1.STATUSES.CONFLICT, false, user_constants_1.default.ERR_INPUT_PASSWORD);
            if (req.body.password !== req.body.reset_password)
                return (0, response_1.response)(res, enums_1.STATUSES.CONFLICT, false, user_constants_1.default.ERR_COINCIDENCE_PASSWORD);
            if (req.body.password.length < 6)
                return (0, response_1.response)(res, enums_1.STATUSES.CONFLICT, false, user_constants_1.default.ERR_MIN_PASSWORD);
            const data = yield user_model_1.default.findById(res.locals.user._id)
                .populate('avatar')
                .populate('course')
                .select('-password -reset');
            data.password = (0, password_1.create)(req.body.password);
            yield data.save();
            (0, response_1.response)(res, enums_1.STATUSES.OK, true, user_constants_1.default.UPDATE_PASSWORD, data);
        }
        catch (err) {
            (0, handler_1.default)(res, err);
        }
    });
};
exports.changePassword = changePassword;
const editExpert = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield user_model_1.default.findById(req.body._id)
                .populate('avatar')
                .select('-password -token -reset');
            if (!data)
                return (0, response_1.response)(res, enums_1.STATUSES.NOT_FOUND, false, user_constants_1.default.NOT_FOUND);
            if (!req.body.password)
                delete req.body.password;
            if (req.body.password)
                req.body.password = (0, password_1.create)(req.body.password);
            req.body.accesses = req.body.accesses_id;
            req.body.avatar = data.avatar;
            for (const key in req.body) {
                if (req.body.hasOwnProperty(key))
                    data[key] = req.body[key];
            }
            yield data.save();
            (0, actions_controller_1.createAction)(res.locals.user._id, `Редактирование аккаунта эксперта - ${data.name} (${data.email})`, 'EXPERT_EDITED');
            (0, response_1.response)(res, enums_1.STATUSES.OK, true, null, data);
        }
        catch (err) {
            (0, handler_1.default)(res, err);
        }
    });
};
exports.editExpert = editExpert;
const editSupport = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield user_model_1.default.findById(req.body._id)
                .populate('avatar')
                .select('-password -token -reset');
            if (!data)
                return (0, response_1.response)(res, enums_1.STATUSES.NOT_FOUND, false, user_constants_1.default.NOT_FOUND);
            req.body.avatar = data.avatar;
            for (const key in req.body) {
                if (req.body.hasOwnProperty(key))
                    data[key] = req.body[key];
            }
            yield data.save();
            (0, actions_controller_1.createAction)(res.locals.user._id, `Редактирование аккаунта СП - ${data.name} (${data.email})`, 'SUPPORT_EDITED');
            (0, response_1.response)(res, enums_1.STATUSES.OK, true, null, data);
        }
        catch (err) {
            (0, handler_1.default)(res, err);
        }
    });
};
exports.editSupport = editSupport;
const deleteUser = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            socket_1.Socket.userAction('logout', req.params._id);
            const user = yield user_model_1.default.findByIdAndDelete(req.params._id);
            (0, actions_controller_1.createAction)(res.locals.user._id, `Удаление аккаунта СП - ${user.name} (${user.email})`, 'USER_DELETED');
            (0, response_1.response)(res, enums_1.STATUSES.OK, true, null, req.params._id);
        }
        catch (err) {
            (0, handler_1.default)(res, err);
        }
    });
};
exports.deleteUser = deleteUser;
const deleteExpert = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield user_model_1.default.findById(req.params._id);
            if (!user)
                return (0, response_1.response)(res, enums_1.STATUSES.OK, true, null, req.params._id);
            yield questionnaire_model_1.default.updateMany({ $or: [{ status: enums_1.QUESTIONNAIRE_STATUSES.NOTSENT }, { status: enums_1.QUESTIONNAIRE_STATUSES.NOTVERIFIED }, { status: enums_1.QUESTIONNAIRE_STATUSES.PROCESS }], expert: req.params._id }, { expert: req.body.expert_id });
            yield courseElement_model_1.default.updateMany({ $or: [{ status: enums_1.COURSES_STATUSES.NOTSENT }, { status: enums_1.COURSES_STATUSES.SENT }, { status: enums_1.COURSES_STATUSES.PROCESS }], expert: req.params._id }, { expert: req.body.expert_id });
            yield questionnaire_model_1.default.updateMany({ $or: [{ status: { $ne: enums_1.QUESTIONNAIRE_STATUSES.NOTSENT } }, { status: { $ne: enums_1.QUESTIONNAIRE_STATUSES.NOTVERIFIED } }, { status: { $ne: enums_1.QUESTIONNAIRE_STATUSES.PROCESS } }], expert: req.params._id }, { prevExpert: user.name });
            (0, actions_controller_1.createAction)(res.locals.user._id, `Удаление аккаунта эксперта - ${user.name} (${user.email})`, 'EXPERT_DELETED');
            socket_1.Socket.userAction('logout', user._id);
            yield user.remove();
            (0, response_1.response)(res, enums_1.STATUSES.OK, true, user_constants_1.default.DELETE_EXPERT, req.params._id);
        }
        catch (err) {
            (0, handler_1.default)(res, err);
        }
    });
};
exports.deleteExpert = deleteExpert;
const deleteUserAvatar = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield user_model_1.default.findById(req.params._id);
            if (!data)
                return (0, response_1.response)(res, enums_1.STATUSES.NOT_FOUND, false, user_constants_1.default.NOT_FOUND);
            const file = yield files_model_1.default.findById(data.avatar);
            if (file) {
                const link = process.env.FILE_FOUND + file.src;
                if (fs_1.default.existsSync(link))
                    fs_1.default.unlinkSync(link);
                yield files_model_1.default.deleteOne({ _id: data.avatar });
            }
            data.avatar = null;
            return (0, response_1.response)(res, enums_1.STATUSES.OK, true, null, data);
        }
        catch (err) {
            (0, handler_1.default)(res, err);
        }
    });
};
exports.deleteUserAvatar = deleteUserAvatar;
exports.default = { getUser: exports.getUser, getUsers: exports.getUsers, getPaginationExperts: exports.getPaginationExperts, getPaginationSupport: exports.getPaginationSupport, getListExperts: exports.getListExperts, createExpert: exports.createExpert, createSupport: exports.createSupport, setUserAvatar: exports.setUserAvatar, changeActive: exports.changeActive, editComments: exports.editComments, updateUser: exports.updateUser, changePassword: exports.changePassword, editExpert: exports.editExpert, editSupport: exports.editSupport, deleteExpert: exports.deleteExpert, deleteUser: exports.deleteUser, deleteUserAvatar: exports.deleteUserAvatar };
//# sourceMappingURL=user.controller.js.map