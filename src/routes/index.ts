import express from "express";
const router = express.Router();


router.get("/", async function (req, res) {
  res.send("Api server running!");
});

router.get("/csrf", async function (req, res) {
  res.send({csrfToken: req.csrfToken() })
});

export { router };
