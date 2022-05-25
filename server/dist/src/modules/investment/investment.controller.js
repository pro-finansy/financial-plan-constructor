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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onDelete = exports.onEdit = exports.onCreate = exports.onToggleBlocked = exports.actual = exports.onUnique = exports.onPost = exports.gets = exports.get = void 0;
const mongodb_1 = require("mongodb");
const investment_model_1 = __importDefault(require("./investment.model"));
const exchange_controller_1 = require("../exchange/exchange.controller");
const common_1 = require("../questionnaire/templates/modules/common");
const handler_1 = __importDefault(require("../../utils/handler"));
const enums_1 = require("../../utils/enums");
const defines_1 = require("../../utils/defines");
const response_1 = require("../../utils/response");
const investment_constants_1 = __importDefault(require("./investment.constants"));
const get = function (_req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const investments = yield investment_model_1.default.find().lean();
            (0, response_1.response)(res, enums_1.STATUSES.OK, true, null, investments);
        }
        catch (err) {
            (0, handler_1.default)(res, err);
        }
    });
};
exports.get = get;
const gets = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const filters = {
                sort: { _id: -1 },
            };
            (0, defines_1.definePagination)(filters, req.query);
            const query = { $or: [{ name: { $regex: req.query.name, $options: "i" } }, { title: { $regex: req.query.name, $options: "i" } }] };
            query['$and'] = [{}, {}];
            query['$and'][0][`currency_${req.query.course}_id`] = { $ne: '' };
            query['$and'][1][`currency_${req.query.course}_id`] = { $ne: undefined };
            const investments = yield investment_model_1.default.find(query, null, filters).lean();
            for (const instrument of investments) {
                instrument.commentLength = instrument.comments.length;
            }
            const total = yield investment_model_1.default.countDocuments(query);
            (0, response_1.getsResponse)(res, enums_1.STATUSES.OK, true, null, investments, total);
        }
        catch (err) {
            (0, handler_1.default)(res, err);
        }
    });
};
exports.gets = gets;
function unique(array) {
    let result = [];
    array = array.reverse();
    for (const el of array) {
        if (!result.find(r => r.name.toLowerCase().trim() === el.name.toLowerCase().trim())) {
            result = [...result, el];
        }
    }
    return result.filter(r => r.name);
}
const onPost = function (list, expertList, expert, course, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const variables = investment_constants_1.default.POST_VARIABLES(course);
            const instruments = yield investment_model_1.default.find({});
            const uniqueList = unique(list);
            const uniqueExpertList = unique(expertList);
            for (const instrument of uniqueList) {
                const { _id, comments } = instrument, currentInstrument = __rest(instrument, ["_id", "comments"]);
                let candidate = instruments.find(i => i.name.trim().toLowerCase() === currentInstrument.name.trim().toLowerCase());
                if (candidate) {
                    updateInstrumentComment(candidate, expert, list);
                    candidate.markModified('comments');
                    delete candidate._doc.__v;
                    yield candidate.save();
                }
            }
            let newInstruments = [];
            for (const instrument of uniqueExpertList) {
                const { _id, comments } = instrument, currentInstrument = __rest(instrument, ["_id", "comments"]);
                let candidate = instruments.find(i => i.name.trim().toLowerCase() === currentInstrument.name.trim().toLowerCase());
                if (candidate) {
                    if (!currentInstrument.expert)
                        currentInstrument.expert = expert;
                    if (!candidate.blocked)
                        for (const key of variables)
                            candidate[key] = currentInstrument[key];
                    updateInstrumentComment(candidate, expert, expertList);
                    candidate.markModified('comments');
                    delete candidate._doc.__v;
                    yield candidate.save();
                }
                else {
                    newInstruments = [...newInstruments, Object.assign(Object.assign({}, currentInstrument), { expert, comments: [{ _id: new mongodb_1.ObjectId(expert), comment: currentInstrument.comment }] })];
                }
            }
            newInstruments = newInstruments.filter(i => i.name);
            yield investment_model_1.default.insertMany(newInstruments);
            console.log('save instruments');
            return;
        }
        catch (err) {
            (0, handler_1.default)(res, err);
        }
    });
};
exports.onPost = onPost;
function updateInstrumentComment(candidate, expert, list) {
    const currentComment = list.find(i => i.name.toLowerCase().trim() === candidate.name.toLowerCase().trim() && i.comment);
    if (candidate && currentComment) {
        const existingComment = candidate.comments.find((c) => String(c._id) === String(expert));
        if (existingComment)
            existingComment.comment = currentComment.comment;
        else
            candidate.comments = [...candidate.comments, { _id: new mongodb_1.ObjectId(expert), comment: currentComment.comment }];
    }
}
const onUnique = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const instruments = yield investment_model_1.default.find().lean();
        let result = [];
        for (const instrument of instruments) {
            if (!result.find(r => r.name.toLowerCase().trim() === instrument.name.toLowerCase().trim())) {
                result = [...result, instrument];
            }
        }
        yield investment_model_1.default.deleteMany({});
        yield investment_model_1.default.insertMany(result);
        (0, response_1.response)(res, enums_1.STATUSES.OK, true, null);
    }
    catch (err) {
        (0, handler_1.default)(res, err);
    }
});
exports.onUnique = onUnique;
const actual = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let rates = (0, common_1.getCurrentExchangeRates)();
        const instruments = yield investment_model_1.default.find().lean();
        for (const i of req.body.instruments) {
            const result = (0, exchange_controller_1.getInstrumentPrice)(i.name);
            if (result) {
                if (i.currency_two_id !== result.currency) {
                    let lot = i.lot || 1;
                    i.price = Number(((result.price / rates[result.currency === 'SUR' ? 'RUB' : result.currency]) * rates[i.currency_two_id]).toFixed(2));
                    i.formula = Number((i.price * lot * i.number_papers).toFixed(2));
                }
                else {
                    i.price = result.price;
                }
            }
            else {
                const instrument = instruments.find(ins => i.name.trim().toLowerCase() === ins.name.trim().toLowerCase());
                if (instrument) {
                    let lot = instrument.lot || 1;
                    i.price = instrument.price;
                    i.formula = Number((i.price * lot * i.number_papers).toFixed(2));
                }
            }
        }
        (0, response_1.response)(res, enums_1.STATUSES.OK, true, investment_constants_1.default.ACTUAL, req.body.instruments);
    }
    catch (err) {
        (0, handler_1.default)(res, err);
    }
});
exports.actual = actual;
const onToggleBlocked = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield investment_model_1.default.findByIdAndUpdate(req.params._id, { blocked: req.body.blocked });
        (0, response_1.response)(res, enums_1.STATUSES.OK, true, null);
    }
    catch (err) {
        (0, handler_1.default)(res, err);
    }
});
exports.onToggleBlocked = onToggleBlocked;
function getInstrumentCourseVariables(course) {
    return [
        `class_${course}`,
        `class_${course}_id`,
        `country_${course}`,
        `country_${course}_id`,
        `currency_${course}`,
        `currency_${course}_id`,
        `base_currency_${course}`,
        `base_currency_${course}_id`,
        `instrument_type_${course}`,
        `instrument_type_${course}_id`,
        `section_${course}`,
        `section_${course}_id`,
    ];
}
const onCreate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const candidate = yield investment_model_1.default.findOne({ name: req.body.name.trim() });
        const course = req.body.course === enums_1.COURSES.TWO ? enums_1.COURSES.ONE : enums_1.COURSES.TWO;
        // if (candidate && candidate[`base_currency_${req.body.course}_id`]) return response(res, STATUSES.CONFLICT, false, constants.EXIST_INSTRUMENT);
        if (candidate && candidate[`base_currency_${course}_id`] && !candidate[`base_currency_${req.body.course}_id`]) {
            const variables = getInstrumentCourseVariables(req.body.course);
            for (const variable of variables) {
                candidate[variable] = req.body[variable];
            }
            yield candidate.save();
            (0, exchange_controller_1.fixTitleInstrument)(candidate);
            (0, response_1.response)(res, enums_1.STATUSES.OK, true, null, candidate);
        }
        else {
            const instrument = new investment_model_1.default(req.body);
            yield instrument.save();
            (0, exchange_controller_1.fixTitleInstrument)(instrument);
            (0, response_1.response)(res, enums_1.STATUSES.OK, true, null, instrument);
        }
    }
    catch (err) {
        (0, handler_1.default)(res, err);
    }
});
exports.onCreate = onCreate;
const onEdit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const candidate = yield investment_model_1.default.findOne({ name: req.body.name.trim() });
        if (candidate && String(candidate._id) !== String(req.body._id))
            return (0, response_1.response)(res, enums_1.STATUSES.CONFLICT, false, investment_constants_1.default.EXIST_INSTRUMENT);
        const course = req.body.course;
        const variables = investment_constants_1.default.POST_VARIABLES(course);
        const instrument = yield investment_model_1.default.findById(req.body._id);
        if (!instrument)
            return (0, response_1.response)(res, enums_1.STATUSES.NOT_FOUND, false, investment_constants_1.default.NOT_FOUND);
        for (const variable of variables)
            instrument[variable] = req.body[variable];
        yield instrument.save();
        (0, exchange_controller_1.fixTitleInstrument)(instrument);
        (0, response_1.response)(res, enums_1.STATUSES.OK, true, null, instrument);
    }
    catch (err) {
        console.log(err);
        (0, handler_1.default)(res, err);
    }
});
exports.onEdit = onEdit;
const onDelete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const candidate = yield investment_model_1.default.findById(req.params._id);
        if (!candidate)
            return (0, response_1.response)(res, enums_1.STATUSES.NOT_FOUND, false, investment_constants_1.default.NOT_FOUND);
        const course = req.query.course === enums_1.COURSES.ONE ? enums_1.COURSES.TWO : enums_1.COURSES.ONE;
        if (candidate[`base_currency_${course}_id`]) {
            const variables = getInstrumentCourseVariables(req.query.course);
            for (const variable of variables) {
                candidate[variable] = '';
            }
            yield candidate.save();
        }
        else {
            yield candidate.remove();
        }
        (0, response_1.response)(res, enums_1.STATUSES.OK, true, null, req.params._id);
    }
    catch (err) {
        (0, handler_1.default)(res, err);
    }
});
exports.onDelete = onDelete;
exports.default = { get: exports.get, gets: exports.gets, onPost: exports.onPost, onUnique: exports.onUnique, onEdit: exports.onEdit, onDelete: exports.onDelete, onCreate: exports.onCreate, onToggleBlocked: exports.onToggleBlocked, actual: exports.actual };
//# sourceMappingURL=investment.controller.js.map