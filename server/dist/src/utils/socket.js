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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Socket = exports.io = void 0;
const enums_1 = require("./enums");
const sockets = require('socket.io');
const io = sockets();
exports.io = io;
let reloadServer = false;
let seconds = 300;
const Socket = {
    emit: (event, data) => {
        console.log(event, data);
        io.sockets.emit(event, data);
    },
    online: () => {
        return io.sockets.sockets.size;
    },
    on: (event, callback) => {
        console.log(event);
        io.sockets.on(event, callback);
    },
    reload: () => {
        const interval = setInterval(() => {
            if (seconds <= 0) {
                clearInterval(interval);
                seconds = 300;
                return;
            }
            seconds -= 1;
            Socket.emit('reloadServer', { status: !!(seconds >= 1), seconds });
        }, 1000);
    },
    userAction: (action, user_id) => {
        Socket.emit(`${action}_${user_id}`, { status: true });
    }
};
exports.Socket = Socket;
io.on("connection", (socket) => {
    if (reloadServer)
        Socket.emit('reloadServer', { status: true, seconds });
    socket.on('leaveRoom', ({ id }) => {
        socket.leave(id);
    });
    socket.on('createRoom', ({ id, role }) => __awaiter(void 0, void 0, void 0, function* () {
        socket.join(id);
        socket.role = role;
        const users = yield io.in(id).fetchSockets();
        console.log(users[0].role);
        if (users.find((user) => user.role === enums_1.ROLES.STUDENT)) {
            users.forEach((user) => {
                io.to(user.id).emit('check', { status: user.role !== enums_1.ROLES.STUDENT });
            });
        }
        else {
            users.forEach((user) => {
                io.to(user.id).emit('check', { status: false });
            });
        }
    }));
    socket.on('disconnect', () => {
        io.emit('online', { online: io.sockets.sockets.size });
    });
});
//# sourceMappingURL=socket.js.map