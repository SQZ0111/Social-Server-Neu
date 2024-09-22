const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const loginRouter = express.Router();
require("dotenv").config();

const User = require("../models/userModel");

//login route to send post request with email and password and check if user exists and if password is correct and to send back jwt
loginRouter.post("/", async (req, res) => {
  const { email, password } = req.body;
  //check if both variables are provided
  if (!email || !password) {
    return res.status(404).send({ message: "Please fill out all fields" });
  }
  //check if user exists
  const existUser = await User.findOne({ email });
  if (!existUser) {
    return res.status(401).send({ message: "User does not exist!" });
  }
  //check if password is correct
  const isPasswordCorrect = await bcrypt.compare(
    password,
    existUser.hashPassword
  );
  if (!isPasswordCorrect) {
    return res.status(401).send({ message: "Password is incorrect" });
  }
  //create jwt token
  const token = jwt.sign({ id: existUser.id }, process.env.JWT_SECRET);
  res.status(200).send({ token, message: "Login successful!" });
});

module.exports = loginRouter;
