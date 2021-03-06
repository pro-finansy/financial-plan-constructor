"use strict";
module.exports = (app) => {
    app.use("/api", require("../src/modules/user/user.routes"), require("../src/modules/auth/auth.routes"), require("../src/modules/faq/faq.routes"), require("../src/modules/actions/actions.routes"), require("../src/modules/currency/currency.routes"), require("../src/modules/analytics/analytics.routes"), require("../src/modules/investment/investment.routes"), require("../src/modules/questionnaire/questionnaire.routes"), require("../src/modules/exchange/exchange.routes"), require("../src/modules/excel/excel.routes"), require("../src/modules/course/course.routes"), require("../src/modules/convert/convert.routes"), require("../src/modules/courseElement/courseElement.routes"), require("../src/modules/mixedAssets/mixed.routes"), require("../src/modules/student/student.routes"));
};
//# sourceMappingURL=routes.js.map