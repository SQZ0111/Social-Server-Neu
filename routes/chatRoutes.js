const express = require("express");
const jwt = require("jsonwebtoken");
const { spawn } = require("child_process");
const path = require("path");

//models
const User = require("../models/userModel");
const { dirname } = require("path");
const chatRouter = express.Router();
require("dotenv").config();

chatRouter.get("/", async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).send({ message: "Unauthorized!" });
  }
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  console.log(decodedToken);
  const user = await User.findOne({ id: decodedToken.id });
  if (!user) {
    return res.status(401).send({ message: "User not found" });
  }
  const chat = user.conversation;
  console.log(chat);
  if (!chat) {
    res.status(401).send({ message: "Not chat found!" });
  }
  res.status(200).send(chat);
});

chatRouter.post("/", async (req, res) => {
  let { userInput } = req.body;
  // console.log(userInput);
  const regex = new RegExp("\\?|\\.", "g");
  userInput = userInput.replace(regex, "");
  // console.log(userInput);
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).send({ message: "Unauthorized!" });
  }
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findOne({ id: decodedToken.id });
  //execute command and param to file
  const prologPathFilePath = path.join(__dirname, "../prolog/chatbot.pl");
  const prolog = spawn("swipl", ["-s", prologPathFilePath]);
  const userInputTokens = userInput.toLowerCase().split(" ");
  console.log(userInputTokens);
  const prologQuery = `response(${JSON.stringify(userInputTokens)}), halt.\n`;
  prolog.stdin.write(prologQuery);
  let output = "";
  let errorOutput = "";
  // Capture stdout data
  prolog.stdout.on("data", (data) => {
    output += data.toString();
  });

  // Capture stderr data
  prolog.stderr.on("data", (data) => {
    errorOutput += data.toString();
  });

  // Handle process errors
  prolog.on("error", (error) => {
    console.error("Prolog process error:", error);
    return res
      .status(500)
      .send({ message: "Prolog process failed", error: error.message });
  });

  // Handle process exit
  prolog.on("close", async (code) => {
    console.log(`child process closed exited with code ${code}`);
    if (code !== 0) {
      console.error(`Prolog stderr: ${errorOutput}`);
      return res
        .status(500)
        .send({ message: "Prolog error", error: errorOutput.trim() });
    }

    const newMessage = {
      userChat: userInput,
      chatAnswer: output.trim(),
    };

    await User.findOneAndUpdate(
      { id: decodedToken.id },
      {
        $push: {
          conversation: newMessage,
        },
      }
    );
    res.status(200).send({ newMessage });
  });

  // Write the query to Prolog's stdin
  prolog.stdin.write(prologQuery);
  prolog.stdin.end(); // Indicate no more data
});
module.exports = chatRouter;
