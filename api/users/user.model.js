const mongoose = require("mongoose");
const { Schema } = mongoose;

const userScheme = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
});

const userModel = mongoose.model("Contact", userScheme);
module.exports = userModel;
