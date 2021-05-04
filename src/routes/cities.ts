import { GetCitieslist } from "../controllers/CitiesController";
import { isAuthenticated } from "../utils";
import express from "express";
import { ApiResponse } from "types/shared";
const router = express.Router();


router.get("/", async function (req, res) {
  if(isAuthenticated(req, res)){
    const result: ApiResponse = await GetCitieslist(req)
    console.log(result)
    res.status(result.code).send({ data:result.data});
  }
});


export { router };
