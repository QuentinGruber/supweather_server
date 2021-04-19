import express from "express";
const router = express.Router();
import { ApiResponse } from "types/shared";
import {} from "../controllers/WeatherController";
import { isAuthenticated } from "../utils";

export { router };
