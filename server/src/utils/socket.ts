import { dynamicsObject } from "../interfaces";
import { ROLES } from "./enums";

const sockets = require('socket.io')
const io = sockets();

let reloadServer = false;
let seconds = 300;

const Socket = {
  emit: (event: string, data: dynamicsObject) => {
    console.log(event, data);
    io.sockets.emit(event, data);
  },
  online: () => {
    return io.sockets.sockets.size;
  },
  on: (event: string, callback: () => void) => {
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
  userAction: (action: string, user_id: string) => {
    Socket.emit(`${action}_${user_id}`, { status: true });
  }
};

io.on("connection", (socket: any) => {
  if (reloadServer) Socket.emit('reloadServer', { status: true, seconds });
  socket.on('leaveRoom', ({ id }: { id: string }) => {
    socket.leave(id);
  });

  socket.on('createRoom', async ({ id, role }: { id: string, role: string }) => {
    socket.join(id);
    socket.role = role;
    const users = await io.in(id).fetchSockets();
    console.log(users[0].role);
    
    if (users.find((user: dynamicsObject) => user.role === ROLES.STUDENT)) {
      users.forEach((user: dynamicsObject) => {
        io.to(user.id).emit('check', { status: user.role !== ROLES.STUDENT });
      });
    } else {
      users.forEach((user: dynamicsObject) => {
        io.to(user.id).emit('check', { status: false });
      });
    }
  });
  socket.on('disconnect', () => {
    io.emit('online', { online: io.sockets.sockets.size });
  });
});


export { io, Socket };