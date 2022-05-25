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
exports.getTickets = exports.get = exports.gets = exports.findByPathName = exports.fillMatDate = exports.getInstrumentPrice = exports.fixTitleInstrument = void 0;
const axios_1 = __importDefault(require("axios"));
const investment_model_1 = __importDefault(require("../investment/investment.model"));
const handler_1 = __importDefault(require("../../utils/handler"));
const response_1 = require("../../utils/response");
const enums_1 = require("../../utils/enums");
const MoexAPI = require('moex-api');
const yahooFinance = require("yahoo-finance");
const moexApi = new MoexAPI();
let tik_list = [];
moexApi.securitiesDataRaw("stock", "shares").then((res) => {
    const result = res.securities.data.map((a) => ({
        symbol: a[0],
        name: a[0],
        title: a[2],
        price: a[3],
        isin: a[19],
        currency: a[24],
        exchange_acronym: "MOEX",
    }));
    tik_list.push(...result);
});
moexApi.securitiesDataRaw("stock", "bonds").then((res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = res.securities.data.map((a) => ({
        symbol: a[0],
        name: a[0],
        isin: a[29],
        title: a[2],
        sectype: a[35],
        currency: a[32],
        exchange_acronym: "MOEX",
        lot: a[9],
        matdate: a[13],
        lastprice: a[3],
        facevalue: a[10],
        price: a[10] > 0 ? Number(((a[10] / 100) * a[3]).toFixed(2)) : a[3]
    }));
    tik_list.push(...result);
    const instruments = yield investment_model_1.default.find().select('name title').lean();
    for (const instrument of instruments) {
        const c = tik_list.find((r) => r.name.trim().toLowerCase() === instrument.name.trim().toLowerCase());
        if (c && instrument.title)
            c.title = instrument.title;
        if (!c)
            tik_list.push({ symbol: instrument.name, name: instrument.name, isin: instrument.name, title: instrument.title, lot: instrument.lot, currency: instrument.currency_two_id, lastprice: instrument.price, price: instrument.price });
    }
    console.log('done MOEX');
}));
function getTicketsList(exchange, complete) {
    const url_one = `http://api.marketstack.com/v1/tickers?access_key=${process.env.EXCHANGE_TOKEN}&limit=10000&exchange=${exchange}`;
    (0, axios_1.default)({
        method: "GET",
        url: url_one,
    })
        .then((new_resp) => {
        complete(new_resp.data.data.map((item) => {
            return {
                symbol: item.symbol,
                name: item.name === null ? "_" : item.name,
                exchange_mic: item.stock_exchange.mic,
                exchange_acronym: item.stock_exchange.acronym,
                country: item.stock_exchange.country,
            };
        }));
    })
        .catch((error) => {
        console.log(`error in get ticket list: ${error}`);
    });
}
function getInfoBySymbol(symbol, userId, complete, error) {
    return __awaiter(this, void 0, void 0, function* () {
        const current_symbol = tik_list.find(i => (i.name && i.name.trim().toLowerCase() === symbol.trim().toLowerCase()) || (i.symbol && i.symbol.trim().toLowerCase() === symbol.trim().toLowerCase()) || (i.isin && i.isin.trim().toLowerCase() === symbol.trim().toLowerCase()));
        if (current_symbol && current_symbol.symbol) {
            symbol = current_symbol.symbol;
        }
        const instrument = yield investment_model_1.default.findOne({ $or: [{ title: symbol }, { name: symbol }] }).lean();
        let comment = { comment: '' };
        if (instrument)
            comment = instrument.comments.find((c) => String(c._id) === String(userId));
        if (symbol.includes("MISX")) {
            moexApi.securityMarketData(symbol.split(".")[0]).then((security) => {
                const price = (Number(security.securityInfo.SECTYPE) === 1 ||
                    Number(security.securityInfo.SECTYPE) === 2)
                    ? security.node.last
                    : ((security.securityInfo.FACEVALUE / 100) * security.node.last).toFixed(2);
                const result = {
                    price: {
                        symbol: symbol.split(".")[0],
                        regularMarketPrice: price,
                        currency: security.securityInfo.CURRENCYID === "SUR"
                            ? "RUB"
                            : security.securityInfo.CURRENCYID,
                        lot: security.securityInfo.LOTSIZE,
                        comment: comment ? comment.comment : ''
                    },
                    instrument,
                };
                complete(result);
            });
        }
        else {
            const security = yield moexApi.securityMarketData(symbol).catch(() => { });
            if (security) {
                const price = (Number(security.securityInfo.SECTYPE) === 1 ||
                    Number(security.securityInfo.SECTYPE) === 2)
                    ? security.node.last
                    : security.securityInfo.FACEVALUE > 0 ? (((security.securityInfo.FACEVALUE / 100) * security.node.last).toFixed(2)) : security.node.last;
                const res = {
                    price: {
                        symbol: symbol,
                        regularMarketPrice: price,
                        currency: security.securityInfo.CURRENCYID === "SUR"
                            ? "RUB"
                            : security.securityInfo.CURRENCYID,
                        lot: security.securityInfo.LOTSIZE,
                        matdate: security.securityInfo.MATDATE,
                        comment: comment ? comment.comment : ''
                    },
                    instrument,
                };
                return complete(res);
            }
            else if (current_symbol) {
                const bond = current_symbol;
                const res = {
                    price: {
                        symbol: symbol,
                        regularMarketPrice: bond.price,
                        currency: bond.currency === "SUR"
                            ? "RUB"
                            : bond.currency,
                        lot: bond.lot,
                        matdate: bond.matdate,
                        comment: comment ? comment.comment : ''
                    },
                    instrument,
                };
                return complete(res);
            }
            else if (instrument) {
                const res = {
                    price: {
                        comment: comment ? comment.comment : ''
                    },
                    instrument
                };
                return complete(res);
            }
            else {
                yahooFinance
                    .quote({
                    symbol,
                    modules: ["price", "summaryDetail"],
                }, (err, quotes) => {
                    if (err)
                        return;
                    complete(quotes);
                })
                    .catch(() => {
                    return error();
                });
            }
        }
    });
}
const getTickets = function () {
    ['XNAS', 'IEXG', 'XNYS', 'XASE'].forEach((item) => {
        getTicketsList(item, (data) => {
            tik_list.push(...data);
            console.log(tik_list.length);
        });
    });
};
exports.getTickets = getTickets;
const fixTitleInstrument = function (instrument) {
    const c = tik_list.find((r) => r.name.trim().toLowerCase() === instrument.name.trim().toLowerCase());
    if (c && instrument.title)
        c.title = instrument.title;
};
exports.fixTitleInstrument = fixTitleInstrument;
const getInstrumentPrice = function (name) {
    const instrument = tik_list.find(i => name.trim().toLowerCase() === i.name.trim().toLowerCase() || (i.isin && name.trim().toLowerCase() === i.isin.trim().toLowerCase()));
    if (instrument)
        return instrument;
    return false;
};
exports.getInstrumentPrice = getInstrumentPrice;
const fillMatDate = function (questionnaire) {
    questionnaire.content_EXPERT.targets.data.forEach((t) => {
        for (const portfolioID in t.portfolios) {
            const portfolio = t.portfolios[portfolioID];
            portfolio.sections[1].modules.forEach((m) => {
                const instrument = tik_list.find(i => i.matdate && (m.data.name.trim().toLowerCase() === i.name.trim().toLowerCase() || (i.isin && m.data.name.trim().toLowerCase() === i.isin.trim().toLowerCase())));
                if (instrument && !m.data.matdate) {
                    m.data.matdate = instrument.matdate;
                }
            });
        }
    });
};
exports.fillMatDate = fillMatDate;
function onUnique(result) {
    let array = [];
    for (const element of result) {
        if (!array.find(e => (element.name && (e.name || '').trim().toLowerCase() === (element.name || '').trim().toLowerCase()) || (element.title && (e.title || '').trim().toLowerCase() === (element.title || '').trim().toLowerCase()) || (element.isin && (e.isin || '').trim().toLowerCase() === (element.isin || '').trim().toLowerCase()))) {
            array = [...array, element];
        }
    }
    return array;
}
const findByPathName = (input) => {
    let _in_symbolist = (a, b) => {
        if (!b || !a)
            return false;
        return b.toLowerCase().trim().includes(a.toLowerCase().trim());
    };
    const result = tik_list.filter((item) => {
        return _in_symbolist(input, item.name) || _in_symbolist(input, item.title) || _in_symbolist(input, item.symbol) || _in_symbolist(input, item.isin);
    });
    const unique = onUnique(result);
    return unique;
};
exports.findByPathName = findByPathName;
const gets = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = (0, exports.findByPathName)(req.params.search);
            const data = result.filter((r, index) => index < 10);
            (0, response_1.response)(res, enums_1.STATUSES.OK, true, null, data);
        }
        catch (err) {
            (0, handler_1.default)(res, err);
        }
    });
};
exports.gets = gets;
const get = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            getInfoBySymbol(req.params.search, res.locals.user._id, (data) => {
                (0, response_1.response)(res, enums_1.STATUSES.OK, true, null, data);
            }, () => {
                (0, response_1.response)(res, enums_1.STATUSES.NOT_FOUND, false, 'Инструмент не найден!');
            });
        }
        catch (err) {
            console.log(err);
            (0, handler_1.default)(res, err);
        }
    });
};
exports.get = get;
exports.default = { get: exports.get, gets: exports.gets, getInstrumentPrice: exports.getInstrumentPrice, fillMatDate: exports.fillMatDate, getTickets };
//# sourceMappingURL=exchange.controller.js.map