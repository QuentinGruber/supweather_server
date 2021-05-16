import express from "express";
import cors from "cors"; // For security issue
import session from "express-session";
import https from "https";
import fs from "fs";
import cluster from "cluster";
import csurf from "csurf";
import cookieParser from "cookie-parser";

require("dotenv").config();
const app = express();

app.use(
  express.json(),
  cookieParser(),
  express.urlencoded({
    extended: true,
  }),

  session({
    resave: true,
    saveUninitialized: false,
    name: "SessionID",
    secret: "such secret",
  }),

  cors({
    credentials: true,
    origin: ["http://localhost:3000"], // only our webapp has access to the database
  }),
  csurf({ cookie: true })
);

if (cluster.isMaster) {
  for (let i = 0; i < 1; i++) {
    cluster.fork();
  }
} else {
  const credentials = {
    key: fs.readFileSync(`${__dirname}/../sslcert/server.key`, "utf8"),
    cert: fs.readFileSync(`${__dirname}/../sslcert/server.crt`, "utf8"),
  };

  var httpsServer = https.createServer(credentials, app);
  app.listen(3001, () => {});
  httpsServer.listen(3002);
}

// routes
import { router as indexRouter } from "./routes/index";
import { router as userRouter } from "./routes/user";
import { router as weatherRouter } from "./routes/weather";
import { router as citiesRouter } from "./routes/cities";

app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/weather", weatherRouter);
app.use("/cities", citiesRouter);
