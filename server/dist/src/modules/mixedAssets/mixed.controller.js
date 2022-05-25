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
exports.onDelete = exports.onPatch = exports.onPost = exports.onGet = exports.onGetList = void 0;
const mixed_model_1 = __importDefault(require("./mixed.model"));
const handler_1 = __importDefault(require("../../utils/handler"));
const response_1 = require("../../utils/response");
const enums_1 = require("../../utils/enums");
const defines_1 = require("../../utils/defines");
const mixed_constants_1 = __importDefault(require("./mixed.constants"));
const actions_controller_1 = require("../actions/actions.controller");
const onGetList = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield mixed_model_1.default.find().lean();
        (0, response_1.response)(res, enums_1.STATUSES.OK, true, null, data);
    }
    catch (err) {
        (0, handler_1.default)(res, err);
    }
});
exports.onGetList = onGetList;
const onGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filters = {};
        (0, defines_1.definePagination)(filters, req.query);
        const query = { name: { $regex: req.query.search, $options: "i" } };
        const data = yield mixed_model_1.default.find(query, null, filters).lean();
        (0, response_1.response)(res, enums_1.STATUSES.OK, true, null, data);
    }
    catch (err) {
        (0, handler_1.default)(res, err);
    }
});
exports.onGet = onGet;
function zeroVariables(body) {
    const vars = ['stock', 'bond', 'alternative'];
    for (const variable of vars) {
        if (!body[variable])
            body[variable] = 0;
    }
}
const onPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.name)
            return (0, response_1.response)(res, enums_1.STATUSES.CONFLICT, false, mixed_constants_1.default.EMPTY_REQUEST);
        const candidate = yield mixed_model_1.default.findOne({ name: req.body.name });
        if (candidate)
            return (0, response_1.response)(res, enums_1.STATUSES.CONFLICT, false, mixed_constants_1.default.EXIST_ASSET);
        delete req.body._id;
        zeroVariables(req.body);
        const asset = new mixed_model_1.default(req.body);
        yield asset.save();
        (0, actions_controller_1.createAction)(res.locals.user._id, `Добавление смешанного актива "${asset.name}"`, "ASSET_CREATED");
        (0, response_1.response)(res, enums_1.STATUSES.OK, true, mixed_constants_1.default.CREATED_ASSET, asset);
    }
    catch (err) {
        console.log(err);
        (0, handler_1.default)(res, err);
    }
});
exports.onPost = onPost;
const onPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const candidate = yield mixed_model_1.default.findOne({ name: req.body.name });
        if (candidate && String(candidate._id) !== String(req.body._id))
            return (0, response_1.response)(res, enums_1.STATUSES.CONFLICT, false, mixed_constants_1.default.EXIST_ASSET);
        const asset = yield mixed_model_1.default.findById(req.body._id);
        if (!asset)
            return (0, response_1.response)(res, enums_1.STATUSES.NOT_FOUND, false, mixed_constants_1.default.NOT_FOUND);
        zeroVariables(req.body);
        for (const key in req.body) {
            if (req.body.hasOwnProperty(key))
                asset[key] = req.body[key];
        }
        yield asset.save();
        (0, actions_controller_1.createAction)(res.locals.user._id, `Редактирование смешанного актива "${asset.name}"`, "MIXED_EDITED");
        (0, response_1.response)(res, enums_1.STATUSES.OK, true, mixed_constants_1.default.EDITED_ASSET, asset);
    }
    catch (err) {
        (0, handler_1.default)(res, err);
    }
});
exports.onPatch = onPatch;
const onDelete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const asset = yield mixed_model_1.default.findByIdAndDelete(req.params._id);
        (0, actions_controller_1.createAction)(res.locals.user._id, `Удаление смешанного актива "${asset.name}"`, "MIXED_DELETED");
        (0, response_1.response)(res, enums_1.STATUSES.OK, true, mixed_constants_1.default.REMOVED_ASSET, req.params._id);
    }
    catch (err) {
        (0, handler_1.default)(res, err);
    }
});
exports.onDelete = onDelete;
exports.default = { onGetList: exports.onGetList, onGet: exports.onGet, onPost: exports.onPost, onPatch: exports.onPatch, onDelete: exports.onDelete };
//# sourceMappingURL=mixed.controller.js.map