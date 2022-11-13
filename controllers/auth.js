const Users = require("../models/User");
const handleError = require("../utils/error");
const randomize = require("randomatic");
const Emailer = require("zoho-node-mailer");
const crypto = require("crypto");

const credentials = {
  username: "developer@leapsail.com.ng",
  password: "Developer@123",
};

Emailer.UseZohoSMTPTransport(credentials);

const register = async (req, res, next) => {
  try {
    let value = randomize("0", 7);
    const user = new Users({ ...req.body, emailToken: value });

    const data = await user.save();

    var mailOptions = {
      from: "developer@leapsail.com.ng",
      to: data.email,
      subject: "Email verification",
      body: `<p> Please use the OTP code below to complete your accout setting</p>
      <h2>${data.emailToken}</h2>
      <a href="https://ardilla-web.netlify.app/otp/${data._id}">
      ${crypto.randomBytes(64).toString("hex")}
      </a>
     `,
      bodyType: "html",
    };

    var result = new Emailer.Email(mailOptions);

    result.send(function (res) {
      console.log(" response : ", res);
    });

    res.status(200).json({
      success: true,
      msg: "check your mail for your verification code",
      data,
    });
  } catch (error) {
    console.log(error);
    next(handleError(500, "Oops , something went wrong."));
  }
};

const getUser = async (req, res, next) => {
  try {
    const id = req.params.id;

    const user = await Users.findById(id);
    if (!user) return next(400, "User does not exist");

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.log(error);
    next(handleError(500, "Oops , something went wrong."));
  }
};

const completeProfile = async () => {
  try {
    const check = await Users.find({ email: req.body.email });

    res.send(check);

    // if (check.platform === "Ardilla") {
    //   res.send(check);
    // }
  } catch (error) {
    console.log(error);
    next(handleError(500, "Oops , something went wrong."));
  }
};

module.exports = { register, getUser, completeProfile };
