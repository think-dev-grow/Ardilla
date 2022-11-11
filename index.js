const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const authRoute = require("./routes/user");

const app = express();
dotenv.config();

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

app.use("/Ardilla/api", authRoute);

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
