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

const getUser = async () => {
  try {
    const user = await Users.findById(req.params.id);
    if (!user) return next(handleError(404, "user not found"));
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    next(handleError(500, "Oops , something went wrong."));
  }
};

module.exports = { register, getUser };
