"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const readHTMLFile_1 = __importDefault(require("../../utils/readHTMLFile"));
const handlebars_1 = __importDefault(require("handlebars"));
const { createTransport } = require('nodemailer');
function default_1(src, data, whom, title) {
    const send = (_err, html) => {
        const template = handlebars_1.default.compile(html);
        sendMail(template(data), whom, title);
    };
    (0, readHTMLFile_1.default)(src, send);
}
exports.default = default_1;
;
function sendMail(html, email, title) {
    const transporter = createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: true,
        auth: {
            user: process.env.EMAIL_LOGIN,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
    const options = {
        from: `"${process.env.PROJECT_NAME}" <${process.env.EMAIL_CURRENT_LOGIN}>`,
        to: email,
        subject: title,
        text: title,
        html,
    };
    transporter.sendMail(options).catch((err) => {
        console.log(err);
    });
}
//# sourceMappingURL=index.js.map