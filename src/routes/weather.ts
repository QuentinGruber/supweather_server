import express from "express";
const router = express.Router();
import { ApiResponse } from "types/shared";
import {
  GetCityWeather,
  GetCityWeatherDaily,
} from "../controllers/WeatherController";
import { isAuthenticated } from "../utils";

router.get("/", async function (req, res) {
  if (isAuthenticated(req, res)) {
    const result: ApiResponse = await GetCityWeather(req);
    res.status(result.code).send({ data: result.data });
  }
});

router.get("/daily", async function (req, res) {
  if (isAuthenticated(req, res)) {
    const result: ApiResponse = await GetCityWeatherDaily(req);
    res.status(result.code).send({ data: result.data });
  }
});

export { router };
