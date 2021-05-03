import express from "express";
import cors from "cors"; // For security issue
import session from "express-session";
import https from "https";
import fs from "fs";

require('dotenv').config();
const app = express();

app.use(
  express.json(),
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
  })
);
const credentials = {key: fs.readFileSync(`${__dirname}/../sslcert/server.key`, 'utf8'), cert: fs.readFileSync(`${__dirname}/../sslcert/server.crt`, 'utf8')};

var httpsServer = https.createServer(credentials, app);
httpsServer.listen(3001);

/*app.listen(3001, () => {
  console.log("Server running !");
});*/


// routes
import { router as indexRouter } from "./routes/index";
import { router as userRouter } from "./routes/user";
import { router as weatherRouter } from "./routes/weather";

app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/weather", weatherRouter);

