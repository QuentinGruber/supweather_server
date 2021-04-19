import express from "express";
import cors from "cors"; // For security issue
import session from "express-session";
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

app.listen(3001, () => {
  console.log("Server running !");
});


// routes
import { router as indexRouter } from "./routes/index";
import { router as userRouter } from "./routes/user";
import { router as weatherRouter } from "./routes/weather";

app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/weather", weatherRouter);

