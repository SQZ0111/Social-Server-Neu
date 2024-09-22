const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

//models
const User = require("../models/userModel");

require("dotenv").config();
const resetRouter = express.Router();

resetRouter.post("/", async (req, res) => {
  const { email } = req.body;
  //console.log(email);
  if (!email) {
    return res.status(404).send({ message: "Please fill Email field!" });
  }
  try {
    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(404).send({ message: "User does not exist!" });
    }
    const code = Math.floor(100000 + Math.random() * 900000);
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD_EMAIL,
      },
    });
    const mailMessage = {
      from: process.env.EMAIL,
      to: email,
      subject: "Reset your with the six digit number",
      text: `Your reset Code ist ${code}`,
    };
    transporter.sendMail(mailMessage, (error, info) => {
      if (error) {
        console.log(`Some Error: ${error}`);
        //return message to frontend
      } else {
        console.log(info);
        const token = jwt.sign({ email: email }, process.env.JWT_SECRET);
        //return message to frontend
        res
          .status(200)
          .send({ code, token, message: "Reset number sent to Email" });
      }
    });
  } catch (e) {
    return res.status(500).send({ message: "Server Error occured!" });
  }
});

resetRouter.put("/newPassword", async (req, res) => {
  try {
    const password = req.body.password;
    const token = req.headers.authorization.split(" ")[1];
    console.log(password, token);
    if (!password || !token) {
      return res.status(404).send({ message: "Missing password!" });
    }
    //console.log(password);
    //console.log(token);
    //console.log("Works");
    //Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhcWliQGNvZGluZ3NjaHVsZS5kZSIsImlhdCI6MTcwMDI5OTE3Nn0.ZIicbXMTtsEjazLilNti7y84ASMHs_tvFYoglKvn-Q8  -> String
    //split
    //["Bearer", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhcWliQGNvZGluZ3NjaHVsZS5kZSIsImlhdCI6MTcwMDI5OTE3Nn0.ZIicbXMTtsEjazLilNti7y84ASMHs_tvFYoglKvn-Q8 "]
    //Indexzugriff bei 0 startend -> [1] -> "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhcWliQGNvZGluZ3NjaHVsZS5kZSIsImlhdCI6MTcwMDI5OTE3Nn0.ZIicbXMTtsEjazLilNti7y84ASMHs_tvFYoglKvn-Q8 "

    //Tokenwert in gültige Email überführen
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    //console.log(decodedToken);
    const existUser = await User.findOne({ email: decodedToken.email });
    if (!existUser) {
      return res.status(404).send({ message: "User does not exist!" });
    }
    //hash Password
    const newHashedPassword = await bcrypt.hash(password, 10);
    const userSet = await User.findOneAndUpdate(
      { email: decodedToken.email },
      { $set: { hashPassword: newHashedPassword } }
    );
    console.log(password, newHashedPassword);
    console.log("password hashed and saved");
    res.status(200).send({ message: "Password updated!" });
  } catch (e) {
    res.status(500).send({ message: "Internal Server Error!" });
  }
});

module.exports = resetRouter;
