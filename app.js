//imports
const express = require("express");
// const axios = require("axios");
const { default: mongoose } = require("mongoose");
const app = express();
const cors = require("cors");

require("dotenv").config();
//import routes
const postRouter = require("./routes/postRoutes");
const postActionRouter = require("./routes/postActionRoutes");
const registerRouter = require("./routes/registerRoutes");
const loginRouter = require("./routes/loginRoutes");
const resetRouter = require("./routes/resetRoutes");
const chatRouter = require("./routes/chatRoutes");
const testRouter = require("./routes/testRoutes");
const PORT = process.env.PORT;
// const multer = require("multer");
//login, token, verschlüsselung
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const rateLimit = require("express-rate-limit");
// const nodemailer = require("nodemailer");
require("dotenv").config();

//https://expressjs.com/en/starter/static-files.html

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const upload = multer({ storage });

//middleware
app.use(cors());
app.use("/uploads", express.static("uploads"));
app.use(async function (req, res, next) {
  await mongoose.connect(process.env.CONNECT_STRING);
  next();
});

//test routes
app.use("/test", testRouter);

//post routes
app.use("/api/posts", postRouter);

app.use(express.json());
// //register routes
app.use("/api/register", registerRouter);

//login routes
app.use("/api/login", loginRouter);

//reset routes
app.use("/api/auth/reset", resetRouter);

//postaction routes
app.use("/api/postAction", postActionRouter);

app.use("/api/chat", chatRouter);

//---------------------------OLD-----------------------------------
//Post schema
// const postSchema = new mongoose.Schema({
//   id: String,
//   title: String,
//   location: String,
//   cost: String,
//   instagramLink: String,
//   pictureUrl: String,
//   imageUrl: String,
//   hearts: Number,
//   comments: {
//     type: Array,
//     default: [],
//   },
// });

// const Post = mongoose.model("Social-Posts", postSchema);

//user schema
// const userSchema = new mongoose.Schema({
//   fullname: {
//     type: String,
//     required: true,
//     minlength: 3,
//     maxlength: 50,
//   },
//   email: {
//     type: String,
//     required: true,
//     minglegth: 8,
//     maxlength: 50,
//   },
//   hashPassword: {
//     type: String,
//     required: true,
//     minglegth: 5,
//   },
//   id: {
//     type: String,
//     required: true,
//   },
//   role: {
//     type: String,
//     required: true,
//     enum: ["student", "parent", "admin"],
//   },
//   likePostsId: {
//     type: Array,
//     default: [],
//   },
// });
// const User = mongoose.model("social-user", userSchema);

//Implement some helper file for user information

//posts
// app.get("/api/posts", async (req, res) => {
//   try {
//     const posts = await Post.find();
//     res.status(200).send(posts);
//   } catch (error) {
//     res.status(500).send({ message: "Could not fetch posts!" });
//   }
// });

// app.post("/api/posts", upload.single("image"), async (req, res) => {
//   // console.log(req.body);
//   const { id, title, location, instagramLink, cost, hearts } = req.body;
//   const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
//     req.file.filename
//   }`;
//   const post = new Post({
//     id,
//     title,
//     location,
//     instagramLink,
//     cost,
//     imageUrl,
//     hearts,
//   });
//   try {
//     await Post.create(post);
//     res.status(201).send({ message: "Post created!" });
//   } catch (error) {
//     res.status(500).send({ message: "Failed to create Post!" });
//   }
// });

//Users

// //limit requests - incoming requests limitieren
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   limit: 5,
// });
// app.use(express.json());
// app.post("/api/register", limiter, async (req, res) => {
//   try {
//     //Daten extrahieren - destructering
//     const { id, fullname, email, password, role } = req.body;
//     if (!id || !fullname || !email || !password || !role) {
//       return res.status(404).send({ message: "Please fill out all fields" });
//     }
//     //existiert user?
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(409).send({ message: "User already exists!" });
//     }
//     const hashPassword = await bcrypt.hash(password, 10);
//     const user = new User({ id, fullname, email, hashPassword, role });
//     await User.create(user);
//     res.status(201).send({ message: "User successfully created!" });
//   } catch (error) {
//     res.status(500).send({ message: "Server register failed" });
//   }
// });

//login route to send post request with email and password and check if user exists and if password is correct and to send back jwt
// app.post("/api/login", async (req, res) => {
//   const { email, password } = req.body;
//   //check if both variables are provided
//   if (!email || !password) {
//     return res.status(404).send({ message: "Please fill out all fields" });
//   }
//   //check if user exists
//   const existUser = await User.findOne({ email });
//   if (!existUser) {
//     return res.status(401).send({ message: "User does not exist!" });
//   }
//   //check if password is correct
//   const isPasswordCorrect = await bcrypt.compare(
//     password,
//     existUser.hashPassword
//   );
//   if (!isPasswordCorrect) {
//     return res.status(401).send({ message: "Password is incorrect" });
//   }
//   //create jwt token
//   const token = jwt.sign({ id: existUser.id }, process.env.JWT_SECRET);
//   res.status(200).send({ token, message: "Login successful!" });
// });

//postAction
// app.post("/api/:postId/like", async (req, res) => {
//   try {
//     console.log("some");
//     const postId = req.params.postId;
//     console.log(postId);
//     console.log(req.params);
//     const token = req.headers.authorization.split(" ")[1];
//     //token decript
//     const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
//     const userId = decodedToken.id;
//     const user = await User.findOne({ id: userId });
//     //check if user has already liked the post (-> Condition: if user likePostId Array does not contain the corresponding postId)
//     if (!user.likePostsId.includes(postId)) {
//       //add a like to the corresponding post of the post id
//       const post = await Post.findOneAndUpdate(
//         { id: postId },
//         { $inc: { hearts: 1 } }
//       );
//       console.log(post);
//       //if post does not exist in database, send an error messsage
//       if (!post) {
//         return res.status(404).send({ message: "Post not found!" });
//       }
//       // console.log(user.likePostsId);
//       await user.likePostsId.push(postId);
//       await user.save();
//       res.status(200).send({ message: "Post liked", post });
//     }
//     //Schicke Nachricht zurück, dass Post nicht erneut geliked werden
//     //später: nehme like aus dem jeweiligen Post zurück
//     else {
//       return res.status(409).send({ message: `User already liked post` });
//     }
//   } catch (e) {
//     res.status(500).send({ message: "Internal Server Error!" });
//   }
// });

// app.post("/api/auth/reset", async (req, res) => {
//   const { email } = req.body;
//   //console.log(email);
//   if (!email) {
//     return res.status(404).send({ message: "Please fill Email field!" });
//   }
//   try {
//     const userExist = await User.findOne({ email });
//     if (!userExist) {
//       return res.status(404).send({ message: "User does not exist!" });
//     }
//     const code = Math.floor(100000 + Math.random() * 900000);
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL,
//         pass: process.env.PASSWORD_EMAIL,
//       },
//     });
//     const mailMessage = {
//       from: process.env.EMAIL,
//       to: email,
//       subject: "Reset your with the six digit number",
//       text: `Your reset Code ist ${code}`,
//     };
//     transporter.sendMail(mailMessage, (error, info) => {
//       if (error) {
//         console.log(`Some Error: ${error}`);
//         //return message to frontend
//       } else {
//         console.log(info);
//         const token = jwt.sign({ email: email }, process.env.JWT_SECRET);
//         //return message to frontend
//         res
//           .status(200)
//           .send({ code, token, message: "Reset number sent to Email" });
//       }
//     });
//   } catch (e) {
//     return res.status(500).send({ message: "Server Error occured!" });
//   }
// });

// app.put("/api/auth/reset/newPassword", async (req, res) => {
//   try {
//     const password = req.body.password;
//     const token = req.headers.authorization.split(" ")[1];
//     console.log(password, token);
//     if (!password || !token) {
//       return res.status(404).send({ message: "Missing password!" });
//     }
//     //console.log(password);
//     //console.log(token);
//     //console.log("Works");
//     //Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhcWliQGNvZGluZ3NjaHVsZS5kZSIsImlhdCI6MTcwMDI5OTE3Nn0.ZIicbXMTtsEjazLilNti7y84ASMHs_tvFYoglKvn-Q8  -> String
//     //split
//     //["Bearer", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhcWliQGNvZGluZ3NjaHVsZS5kZSIsImlhdCI6MTcwMDI5OTE3Nn0.ZIicbXMTtsEjazLilNti7y84ASMHs_tvFYoglKvn-Q8 "]
//     //Indexzugriff bei 0 startend -> [1] -> "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhcWliQGNvZGluZ3NjaHVsZS5kZSIsImlhdCI6MTcwMDI5OTE3Nn0.ZIicbXMTtsEjazLilNti7y84ASMHs_tvFYoglKvn-Q8 "

//     //Tokenwert in gültige Email überführen
//     const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
//     //console.log(decodedToken);
//     const existUser = await User.findOne({ email: decodedToken.email });
//     if (!existUser) {
//       return res.status(404).send({ message: "User does not exist!" });
//     }
//     //hash Password
//     const newHashedPassword = await bcrypt.hash(password, 10);
//     const userSet = await User.findOneAndUpdate(
//       { email: decodedToken.email },
//       { $set: { hashPassword: newHashedPassword } }
//     );
//     console.log(password, newHashedPassword);
//     console.log("password hashed and saved");
//     res.status(200).send({ message: "Password updated!" });
//   } catch (e) {
//     res.status(500).send({ message: "Internal Server Error!" });
//   }
// });
// app.post("/api/comment", async (req, res) => {
//   try {
//     //Extract necessary values from request body
//     const { postId, comment, time } = req.body;
//     //get Token from header
//     const token = req.headers.authorization.split(" ")[1];
//     console.log(token);
//     //get the coressponding object from the token (here the user)
//     const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
//     console.log(decodedToken);
//     const userEntry = await User.findOne({ id: decodedToken.id });
//     console.log(userEntry);
//     const user = userEntry.fullname;
//     console.log(user);
//     //find corresponding post with post id sent from frontend to find the post which the comment should
//     //appended to. Update the found post with the comments object
//     const post = await Post.findOneAndUpdate(
//       { id: postId },
//       {
//         $push: {
//           comments: {
//             user: user,
//             commented: comment,
//             timeStamp: time,
//           },
//         },
//       }
//     );
//     console.log(post);
//     res.status(200).send({ message: "Commented Post!" });
//   } catch (e) {
//     res.status(500).send({ message: "Internalt Server Error" });
//   }
// });

//quotecard
// app.get("/api/quotes", async (req, res) => {
//   const resp = await axios("https://zenquotes.io/api/quotes/");
//   res.send(resp.data);
// });

// app.get("/health-check", (req, res) => {
//   res.status(200).send("All right!");
// });

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});
