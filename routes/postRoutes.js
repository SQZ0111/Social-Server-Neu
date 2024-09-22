const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");

const postRouter = express.Router();
require("dotenv").config();
//models
const Post = require("../models/postModel");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

//posts
postRouter.post("/", upload.single("image"), async (req, res) => {
  // console.log(req.body);
  const { id, title, location, instagramLink, cost, hearts } = req.body;
  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
    req.file.filename
  }`;
  const post = new Post({
    id,
    title,
    location,
    instagramLink,
    cost,
    imageUrl,
    hearts,
  });
  try {
    await Post.create(post);
    res.status(201).send({ message: "Post created!" });
  } catch (error) {
    res.status(500).send({ message: "Failed to create Post!" });
  }
});

postRouter.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).send(posts);
  } catch (error) {
    res.status(500).send({ message: "Could not fetch posts!" });
  }
});

module.exports = postRouter;
