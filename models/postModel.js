const { default: mongoose } = require("mongoose");

//Post schema
const postSchema = new mongoose.Schema({
  id: String,
  title: String,
  location: String,
  cost: String,
  instagramLink: String,
  pictureUrl: String,
  imageUrl: String,
  hearts: Number,
  comments: {
    type: Array,
    default: [],
  },
});

const Post = mongoose.model("Social-Posts", postSchema);

module.exports = Post;
