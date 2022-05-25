import express, { Application, Request, Response } from "express";

import fs from 'fs';
import https from 'https';
import http from 'http';
import { io } from "../src/utils/socket";

const options = {
  key: fs.readFileSync(__dirname + '/../src/keys/private.key'),
  cert: fs.readFileSync(__dirname + '/../src/keys/cert.crt'),
  ca: [
    fs.readFileSync(__dirname + '/../src/keys/bundle.crt'),
    fs.readFileSync(__dirname + '/../src/keys/bundle2.crt'),
  ]
};

const liveMServer = (app: Application) => {
  const { createAdapter } = require("@socket.io/cluster-adapter");
  const { setupWorker } = require("@socket.io/sticky");
  const server = https.createServer(options, app);
  io.attach(server, {
    cors: {
      origin: "*"
    }
  });
  io.adapter(createAdapter());
  setupWorker(io);

  server.listen(443, function () {
    console.log('Server started!');
  });

  const httpApp = express();
  httpApp.all('*', (req: Request, res: Response) => {
    res.redirect('https://' + req.headers.host);
  });
  const httpServer = http.createServer(httpApp);
  httpServer.listen(80, () => console.log('HTTP server listening'));
};

const devMServer = (app: Application) => {
  const { createAdapter } = require("@socket.io/cluster-adapter");
  const { setupWorker } = require("@socket.io/sticky");
  const http = require('http').createServer(app);
  io.attach(http, {
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

const devQServer = (app: Application) => {
  const http = require('http').createServer(app);
  http.listen(process.env.QUETIONNAIRE_PORT || 3001, function () {
    console.log(`Questionnaire server has been started on ${process.env.QUETIONNAIRE_PORT || 3001}`);
  });
};

const liveQServer = (app: Application) => {
  const server = https.createServer(options, app);
  server.listen(process.env.QUETIONNAIRE_PORT || 3001, function () {
    console.log(`Questionnaire server has been started on ${process.env.QUETIONNAIRE_PORT || 3001}`);
  });
}

const devAServer = (app: Application) => {
  const http = require('http').createServer(app);
  http.listen(process.env.AUTOSAVE_PORT || 3002, function () {
    console.log(`Autosave server has been started on ${process.env.AUTOSAVE_PORT || 3002}`);
  });
};

const liveAServer = (app: Application) => {
  const server = https.createServer(options, app);
  server.listen(process.env.AUTOSAVE_PORT || 3002, function () {
    console.log(`Questionnaire server has been started on ${process.env.QUETIONNAIRE_PORT || 3001}`);
  });
}

const devRServer = (app: Application) => {
  const http = require('http').createServer(app);
  http.listen(process.env.RESERVE_PORT || 3003, function () {
    console.log(`Reserve server has been started on ${process.env.RESERVE_PORT || 3003}`);
  });
};

const liveRServer = (app: Application) => {
  const server = https.createServer(options, app);
  server.listen(process.env.RESERVE_PORT || 3003, function () {
    console.log(`Reserve server has been started on ${process.env.RESERVE_PORT || 3003}`);
  });
}

export { liveMServer, liveRServer, liveQServer, liveAServer, devAServer, devRServer, devQServer, devMServer };