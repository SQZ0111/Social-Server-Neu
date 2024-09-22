const express = require("express");
const testRouter = express.Router();

testRouter.get("/", (req, res) => {
  res.status(200).send("All right!");
});

module.exports = testRouter;
