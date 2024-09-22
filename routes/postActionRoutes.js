const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();
//models
const User = require("../models/userModel");
const Post = require("../models/postModel");
const postActionRouter = express.Router();

postActionRouter.post("/:postId/like", async (req, res) => {
  try {
    console.log("some");
    const postId = req.params.postId;
    console.log(postId);
    console.log(req.params);
    const token = req.headers.authorization.split(" ")[1];
    //token decript
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.id;
    const user = await User.findOne({ id: userId });
    //check if user has already liked the post (-> Condition: if user likePostId Array does not contain the corresponding postId)
    if (!user.likePostsId.includes(postId)) {
      //add a like to the corresponding post of the post id
      const post = await Post.findOneAndUpdate(
        { id: postId },
        { $inc: { hearts: 1 } }
      );
      console.log(post);
      //if post does not exist in database, send an error messsage
      if (!post) {
        return res.status(404).send({ message: "Post not found!" });
      }
      // console.log(user.likePostsId);
      user.likePostsId.push(postId);
      await user.save();
      res.status(200).send({ message: "Post liked", post });
    }
    //Schicke Nachricht zurück, dass Post nicht erneut geliked werden
    //später: nehme like aus dem jeweiligen Post zurück
    else {
      const post = await Post.findOneAndUpdate(
        { id: postId },
        { $set: { hearts: 0 } }
      );
      let newLikePostsId = user.likePostsId.filter((el) => el !== postId);
      await user.updateOne({likePostsId: newLikePostsId});
      return res.status(200).send({ message: `Took Like away` });
    }
  } catch (e) {
    res.status(500).send({ message: "Internal Server Error!" });
  }
});

postActionRouter.post("/comment", async (req, res) => {
  try {
    //Extract necessary values from request body
    const { postId, comment, time } = req.body;
    //get Token from header
    const token = req.headers.authorization.split(" ")[1];
    console.log(token);
    //get the coressponding object from the token (here the user)
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decodedToken);
    const userEntry = await User.findOne({ id: decodedToken.id });
    console.log(userEntry);
    const user = userEntry.fullname;
    console.log(user);
    //find corresponding post with post id sent from frontend to find the post which the comment should
    //appended to. Update the found post with the comments object
    const post = await Post.findOneAndUpdate(
      { id: postId },
      {
        $push: {
          comments: {
            user: user,
            commented: comment,
            timeStamp: time,
          },
        },
      }
    );
    console.log(post);
    res.status(200).send({ message: "Commented Post!" });
  } catch (e) {
    res.status(500).send({ message: "Internalt Server Error" });
  }
});
module.exports = postActionRouter;
