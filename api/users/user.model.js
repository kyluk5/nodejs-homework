const mongoose = require("mongoose");
const { Schema } = mongoose;

const userScheme = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  subscription: {
    type: String,
    enum: ["free", "pro", "premium"],
    default: "free",
  },
  token: { type: String },
});

const userModel = mongoose.model("User", userScheme);
module.exports = userModel;
