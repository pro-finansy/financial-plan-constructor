"use strict";
const enums_1 = require("./enums");
module.exports = (res, error) => {
    res.status(enums_1.STATUSES.SERVER).json(error.message ? error.message : error);
};
//# sourceMappingURL=handler.js.map