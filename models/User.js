const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstname: { type: String, default: "" },
    lastname: { type: String, default: "" },
    uid: { type: String, default: "" },
    email: { type: String, default: "" },
    emailToken: { type: String, default: "" },
    contact: { type: String, default: "" },
    dhid: { type: String, default: "" },
    platform: { type: String, default: "Ardilla" },
    uid: { type: String, default: "" },
    password: { type: String, default: "" },
    isAdmin: { type: String, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Users", UserSchema);
