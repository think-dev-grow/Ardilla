const Users = require("../models/User");
const handleError = require("../utils/error");
const { Random } = require("random-js");
const randomize = require("randomatic");
const rn = require("random-number");
const Emailer = require("zoho-node-mailer");
const crypto = require("crypto");

const jwt = require("jsonwebtoken");

const jwtSecret = "123456789";

const random = new Random();

const options = {
  min: 100,
  max: 999,
  integer: true,
};

const credentials = {
  username: "developer@leapsail.com.ng",
  password: "Developer@123",
};

Emailer.UseZohoSMTPTransport(credentials);

const register = async (req, res, next) => {
  const check = await Users.findOne({
    email: req.body.email,
    platform: "Ardilla",
  });
  try {
    if (check) {
      return next(handleError(400, "User alreasy exist"));
    } else {
      let value = randomize("0", 7);
      const user = new Users({ ...req.body, emailToken: value });

      const data = await user.save();

      const payload = {
        id: data._id,
        email: data.email,
        token: value,
      };

      const token = jwt.sign(payload, jwtSecret, { expiresIn: "8m" });

      const mailOptions = {
        from: "developer@leapsail.com.ng",
        to: data.email,
        subject: "Email verification",
        body: `
        
      <p> Please use the OTP code below to complete your accout setting</p>
      <h2>${data.emailToken}</h2>
      <a href="https://ardilla-web.netlify.app/complete-profile">
      https://ardilla/complete-profile/${crypto
        .randomBytes(64)
        .toString("hex")}/com
      </a>
       
     `,
        bodyType: "html",
      };

      const result = new Emailer.Email(mailOptions);

      result.send(function (info) {
        console.log(" response : ", info);
      });

      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json({
          success: true,
          msg: "check your mail for your verification code",
          data,
        });
    }
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

const verifyOTP = async (req, res, data) => {
  try {
    const { code } = req.body;

    const verify = req.user.token;

    if (code === verify) {
      return res
        .status(200)
        .json({ success: true, msg: "verification okay", data: req.user });
    } else {
      return res.status(400).json({ success: false, msg: "Incorrect token" });
    }
  } catch (error) {
    console.log(error);
    next(handleError(500, "Oops , something went wrong."));
  }
};

const resendOTP = async (req, res, data) => {
  try {
    let value = randomize("0", 7);

    const user = await Users.findOneAndUpdate(
      { _id: req.params.id },
      { emailToken: value },
      { new: true }
    );

    const mailOptions = {
      from: "developer@leapsail.com.ng",
      to: user.email,
      subject: "Email verification",
      body: `
      
    <p> Please use the OTP code below to complete your accout setting</p>
    <h2>${user.emailToken}</h2>
    <a href="https://ardilla-web.netlify.app/complete-profile">
    https://ardilla/complete-profile/${crypto
      .randomBytes(64)
      .toString("hex")}/com
    </a>
     
   `,
      bodyType: "html",
    };

    const result = new Emailer.Email(mailOptions);

    result.send(function (info) {
      console.log(" response : ", info);
    });

    const payload = {
      id: user._id,
      email: user.email,
      token: value,
    };

    const token = jwt.sign(payload, jwtSecret, { expiresIn: "8m" });

    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({
        success: true,
        msg: "verification code has be resend",
        user,
      });

    const { code } = req.body;

    const verify = req.user.token;

    if (code === verify) {
      return res
        .status(200)
        .json({ success: true, msg: "verification okay", data: req.user });
    } else {
      return res.status(400).json({ success: false, msg: "Incorrect token" });
    }
  } catch (error) {
    console.log(error);
    next(handleError(500, "Oops , something went wrong."));
  }
};

const completeProfile = async (req, res, next) => {
  try {
    const check = await Users.findById(req.params.id);

    if (!check) {
      return next(handleError(404, "User does not exist."));
    } else {
      check.firstname = req.body.firstname;
      check.lastname = req.body.lastname;
      check.uid = `30${rn(options)}${random.integer(10, 99)}${randomize(
        "0",
        3
      )}`;
      check.dhid = crypto.randomBytes(64).toString("hex");
      check.contact = req.body.contact;
      check.password = req.body.password;

      const verifiedUser = await check.save();

      res.status(200).json(verifiedUser);
    }
  } catch (error) {
    console.log(error);
    next(handleError(500, "Oops , something went wrong."));
  }
};

module.exports = { register, getUser, completeProfile, verifyOTP, resendOTP };
