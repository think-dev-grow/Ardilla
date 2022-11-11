const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstname: { type: String },
    lastname: { type: String },
    uid: { type: String },
    email: { type: String },
    contact: { type: String },
    dhid: { type: String },
    platform: { type: String, default: "Ardilla" },
    uid: { type: String },
    password: { type: String },
    isAdmin: { type: String, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Users", UserSchema);
