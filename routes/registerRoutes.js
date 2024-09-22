const express = require("express");
const rateLimit = require("express-rate-limit");
const bcrypt = require("bcrypt");

//model
const User = require("../models/userModel");
const registerRouter = express.Router();
//limit requests - incoming requests limitieren
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5,
});

registerRouter.post("/", limiter, async (req, res) => {
  try {
    //Daten extrahieren - destructering
    const { id, fullname, email, password, role } = req.body;
    if (!id || !fullname || !email || !password || !role) {
      return res.status(404).send({ message: "Please fill out all fields" });
    }
    //existiert user?
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).send({ message: "User already exists!" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({ id, fullname, email, hashPassword, role });
    await User.create(user);
    res.status(201).send({ message: "User successfully created!" });
  } catch (error) {
    res.status(500).send({ message: "Server register failed" });
  }
});

module.exports = registerRouter;
