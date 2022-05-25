import express from "express";
import routes from '../../config/routes';
import modules from '../../config/modules';
import database from '../../config/database';
import { devRServer, liveRServer } from "../../config/server";
const app = express();

modules(app, express);
database();
routes(app);

if (process.env.NODE_ENV === 'production') {
  liveRServer(app);
} else {
  devRServer(app);
}

process.on('uncaughtException', function (err) {
  console.error(err);
  console.log("Node NOT Exiting...");
});