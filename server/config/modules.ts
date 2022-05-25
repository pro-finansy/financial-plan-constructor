import { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import compression from 'compression';
import rateLimit from "express-rate-limit";

export = (app: Application, express: any) => {
  dotenv.config();
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(express.json({ limit: '50MB' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(require("morgan")("dev"));
  app.use(cors());
  app.use(compression());

  const apiLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 10000
  });
  app.use("/api/", apiLimiter);

  Object.typedKeys = Object.keys as any;
}
