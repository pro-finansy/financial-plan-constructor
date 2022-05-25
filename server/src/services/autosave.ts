import express from "express";
import routes from '../../config/routes';
import modules from '../../config/modules';
import database from '../../config/database';
import { devAServer, liveAServer } from "../../config/server";
const app = express();

modules(app, express);
database();
routes(app);

if (process.env.NODE_ENV === 'production') {
  liveAServer(app);
} else {
  devAServer(app);
}

process.on('uncaughtException', function (err) {
  console.error(err);
  console.log("Node NOT Exiting...");
});