import express from "express";
const router = express.Router();
import { saveUserSession } from "../utils";
import { ApiResponse } from "types/shared";
import { isAuthenticated } from "../utils";
import {
  register,
  login,
} from "../controllers/UserController";

router.post("/sign_up", async function (req, res) {
  const result: ApiResponse = await register(req);
  result.data ? saveUserSession(req, result.data) : null;
  res.status(result.code).send({ error: result.error });
});

router.post("/sign_in", async function (req, res) {
  const result: ApiResponse = await login(req);
  result.data ? saveUserSession(req, result.data) : null;
  res.status(result.code).send({ error: result.error });
});

router.delete("/disconnect", function (req, res) {
  try {
    req.session.destroy(() => {});
    res.status(200).send();
  } catch (e) {
    console.log("Error while disconnecting : " + e);
    res.status(406).send();
  }
});

export { router };
