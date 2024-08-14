import "reflect-metadata";
import express, { Application, NextFunction, Request, Response } from "express";
const app: Application = express();
import bodyParser from "body-parser";
import helmet from "helmet";
import cors from "cors";
import { StatusCodes } from "http-status-codes";
import { clientBadRequestError, clientPatheNotFoundError } from "./middlewares/appErrors";
import applicationRoutes from "./app/base/base.routes";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(bodyParser.json());

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.disable("x-powered-by");

const apiPath = "/api/v1";
app.get(apiPath, (_: Request, res: Response) => {
  return res
    .status(StatusCodes.OK)
    .json({
      message: "Welcome to BUILDCLAW-SERVICE",
      statusCode: 200,
      data: null,
    });
});

app.use(apiPath, applicationRoutes)
app.use(clientBadRequestError)
app.use(clientPatheNotFoundError)


export default app;
