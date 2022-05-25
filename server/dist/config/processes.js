"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const node_schedule_1 = __importDefault(require("node-schedule"));
const convert_controller_1 = require("../src/modules/convert/convert.controller");
const exchange_controller_1 = require("../src/modules/exchange/exchange.controller");
module.exports = () => {
    const times = '30 * * * *'; // 30 минут
    node_schedule_1.default.scheduleJob(times, function () {
        (0, convert_controller_1.getCurrencies)();
    });
    (0, exchange_controller_1.getTickets)();
};
//# sourceMappingURL=processes.js.map