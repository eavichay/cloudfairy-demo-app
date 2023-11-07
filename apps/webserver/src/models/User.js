const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    match: [/\S+@\S+\.\S+/, "is invalid"],
    index: true,
  },
  bio: {
    type: String,
    default: "",
  },
  image: {
    type: String,
    default: "https://static.productionready.io/images/smiley-cyrus.jpg",
  },
  favouritedArticles: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Article" },
  ],
  followingUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

userSchema.plugin(uniqueValidator);

userSchema.methods.generateAccessToken = function () {
  const accessToken = jwt.sign(
    {
      user: {
        id: this._id,
        email: this.email,
        password: this.password,
      },
    },
    "top-secret-access-token",
    { expiresIn: "1d" }
  );
  return accessToken;
};

userSchema.methods.toUserResponse = function () {
  return {
    username: this.username,
    email: this.email,
    bio: this.bio,
    image: this.image,
    token: this.generateAccessToken(),
  };
};

userSchema.methods.toProfileJSON = function (user) {
  return {
    username: this.username,
    bio: this.bio,
    image: this.image,
    following: user ? user.isFollowing(this._id) : false,
  };
};

module.exports.User = mongoose.model("User", userSchema);
module.exports.User.createCollection();
