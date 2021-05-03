import express from "express";
const router = express.Router();
import { saveUserSession,isAuthenticated } from "../utils";
import { ApiResponse } from "types/shared";
import {
  register,
  login,
  toggleTheme,
  addCity,
  removeCity,
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

router.put("/toggle_theme", async function (req, res) {
  if(isAuthenticated(req, res)){
    const result: ApiResponse = await toggleTheme(req);
    res.status(result.code).send({ error: result.error });
  }
});

router.put("/add_city", async function (req, res) {
  if(isAuthenticated(req, res)){
    const result: ApiResponse = await addCity(req);
    res.status(result.code).send({ error: result.error });
  }
});

router.delete("/remove_city", async function (req, res) {
  if(isAuthenticated(req, res)){
    const result: ApiResponse = await removeCity(req);
    res.status(result.code).send({ error: result.error });
  }
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
