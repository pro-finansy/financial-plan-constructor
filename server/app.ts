import express from "express";
import routes from './config/routes';
import modules from './config/modules';
import globalProcesses from './config/processes';
import database from './config/database';
import { devMServer, liveMServer } from "./config/server";

const app = express();

modules(app, express);
globalProcesses();
database();
routes(app);

if (process.env.NODE_ENV === 'production') {
  liveMServer(app);
} else {
  devMServer(app);
}

app.use(express.static(__dirname + '/public'));
app.get(/.*/, (_req, res) => res.sendFile(__dirname + '/public/index.html'));

process.on('uncaughtException', function (err) {
  console.error(err);
  console.log("Node NOT Exiting...");
});