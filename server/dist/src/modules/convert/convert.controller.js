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
exports.get = exports.getCurrencies = void 0;
const axios_1 = __importDefault(require("axios"));
const convert_model_1 = __importDefault(require("./convert.model"));
const handler_1 = __importDefault(require("../../utils/handler"));
const response_1 = require("../../utils/response");
const enums_1 = require("../../utils/enums");
const getCurrencies = () => {
    const options = {
        method: 'GET',
        url: 'https://data.fixer.io/api/latest?base=USD&access_key=' + process.env.CURRENCY_KEY,
        params: { format: 'json' },
    };
    axios_1.default
        .request(options)
        .then((res) => __awaiter(void 0, void 0, void 0, function* () {
        let convert = yield convert_model_1.default.findOne();
        if (!convert)
            convert = new convert_model_1.default();
        convert.list = res.data.rates;
        yield convert.save();
    })).catch(err => {
        console.error(err);
    });
};
exports.getCurrencies = getCurrencies;
const get = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const convert = yield convert_model_1.default.findOne({}).lean();
        (0, response_1.response)(res, enums_1.STATUSES.OK, true, null, convert);
    }
    catch (err) {
        (0, handler_1.default)(res, err);
    }
});
exports.get = get;
exports.default = { get: exports.get, getCurrencies: exports.getCurrencies };
//# sourceMappingURL=convert.controller.js.map