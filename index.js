const express = require("express");
const app = express();
const randomize = require("randomatic");

const mongoose = require("mongoose");

const dotenv = require("dotenv");
dotenv.config();

const cors = require("cors");

app.use(cors());

const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");

app.use(express.json());

const connectDB = () => {
  mongoose
    .connect(process.env.MONGO)
    .then(() => {
      console.log("DB connected.");
    })
    .catch((err) => {
      console.log(err);
    });
};

app.use("/ardilla/api/auth", authRoute);
app.use("/ardilla/api/user", userRoute);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";

  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  connectDB();

  console.log("Server connected.");
});
