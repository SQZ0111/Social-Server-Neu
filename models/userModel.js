const { default: mongoose } = require("mongoose");

//user schema
const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minglegth: 8,
    maxlength: 50,
  },
  hashPassword: {
    type: String,
    required: true,
    minglegth: 5,
  },
  id: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["student", "parent", "admin"],
  },
  likePostsId: {
    type: Array,
    default: [],
  },
  conversation: {
    type: Array,
    default: []
  }
});
const User = mongoose.model("social-user", userSchema);

module.exports = User;
