"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.devMServer = exports.devQServer = exports.devRServer = exports.devAServer = exports.liveAServer = exports.liveQServer = exports.liveRServer = exports.liveMServer = void 0;
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const https_1 = __importDefault(require("https"));
const http_1 = __importDefault(require("http"));
const socket_1 = require("../src/utils/socket");
const options = {
    key: fs_1.default.readFileSync(__dirname + '/../src/keys/private.key'),
    cert: fs_1.default.readFileSync(__dirname + '/../src/keys/cert.crt'),
    ca: [
        fs_1.default.readFileSync(__dirname + '/../src/keys/bundle.crt'),
        fs_1.default.readFileSync(__dirname + '/../src/keys/bundle2.crt'),
    ]
};
const liveMServer = (app) => {
    const { createAdapter } = require("@socket.io/cluster-adapter");
    const { setupWorker } = require("@socket.io/sticky");
    const server = https_1.default.createServer(options, app);
    socket_1.io.attach(server, {
        cors: {
            origin: "*"
        }
    });
    socket_1.io.adapter(createAdapter());
    setupWorker(socket_1.io);
    server.listen(443, function () {
        console.log('Server started!');
    });
    const httpApp = (0, express_1.default)();
    httpApp.all('*', (req, res) => {
        res.redirect('https://' + req.headers.host);
    });
    const httpServer = http_1.default.createServer(httpApp);
    httpServer.listen(80, () => console.log('HTTP server listening'));
};
exports.liveMServer = liveMServer;
const devMServer = (app) => {
    const { createAdapter } = require("@socket.io/cluster-adapter");
    const { setupWorker } = require("@socket.io/sticky");
    const http = require('http').createServer(app);
    socket_1.io.attach(http, {
        cors: {
            origin: "*"
        }
    });
    // io.adapter(createAdapter());
    // setupWorker(io);
    http.listen(process.env.PORT || 3000, function () {
        console.log(`Main server [${process.pid}] has been started on ${process.env.PORT || 3000}`);
    });
};
exports.devMServer = devMServer;
const devQServer = (app) => {
    const http = require('http').createServer(app);
    http.listen(process.env.QUETIONNAIRE_PORT || 3001, function () {
        console.log(`Questionnaire server has been started on ${process.env.QUETIONNAIRE_PORT || 3001}`);
    });
};
exports.devQServer = devQServer;
const liveQServer = (app) => {
    const server = https_1.default.createServer(options, app);
    server.listen(process.env.QUETIONNAIRE_PORT || 3001, function () {
        console.log(`Questionnaire server has been started on ${process.env.QUETIONNAIRE_PORT || 3001}`);
    });
};
exports.liveQServer = liveQServer;
const devAServer = (app) => {
    const http = require('http').createServer(app);
    http.listen(process.env.AUTOSAVE_PORT || 3002, function () {
        console.log(`Autosave server has been started on ${process.env.AUTOSAVE_PORT || 3002}`);
    });
};
exports.devAServer = devAServer;
const liveAServer = (app) => {
    const server = https_1.default.createServer(options, app);
    server.listen(process.env.AUTOSAVE_PORT || 3002, function () {
        console.log(`Questionnaire server has been started on ${process.env.QUETIONNAIRE_PORT || 3001}`);
    });
};
exports.liveAServer = liveAServer;
const devRServer = (app) => {
    const http = require('http').createServer(app);
    http.listen(process.env.RESERVE_PORT || 3003, function () {
        console.log(`Reserve server has been started on ${process.env.RESERVE_PORT || 3003}`);
    });
};
exports.devRServer = devRServer;
const liveRServer = (app) => {
    const server = https_1.default.createServer(options, app);
    server.listen(process.env.RESERVE_PORT || 3003, function () {
        console.log(`Reserve server has been started on ${process.env.RESERVE_PORT || 3003}`);
    });
};
exports.liveRServer = liveRServer;
//# sourceMappingURL=server.js.map