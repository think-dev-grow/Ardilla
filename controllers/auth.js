const Users = require("../models/User");
const handleError = require("../utils/error");
const { Random } = require("random-js");
const randomize = require("randomatic");
const rn = require("random-number");
const Emailer = require("zoho-node-mailer");
const crypto = require("crypto");

var { SendMailClient } = require("zeptomail");

const url = "api.zeptomail.com/";
const zohoToken =
  "Zoho-enczapikey wSsVR612/BT5D/1/yTSvc+Y/mFsBUg+gFB900AfyuHP4HfDK9sdul0TPDFWvT/BJEGRqQGdD9rp6y00H0TQHiokkmVEAWyiF9mqRe1U4J3x17qnvhDzJW2pclhOBJIsNxg1ik2JiEs0n+g==";

let client = new SendMailClient({ url, zohoToken });

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const jwtSecret = "123456789";

const random = new Random();

const options = {
  min: 100,
  max: 999,
  integer: true,
};

// const credentials = {
//   username: "no-reply@leapsail.com.ng",
//   password: "Ardilla@2580",
// };

// Emailer.UseZohoSMTPTransport(credentials);

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

      const token = jwt.sign(payload, jwtSecret, { expiresIn: "3m" });

      client
        .sendMail({
          bounce_address: "NOREPLY@bounce.ardilla.africa",
          from: {
            address: "noreply@ardilla.africa",
            name: "noreply",
          },
          to: [
            {
              email_address: {
                address: `${data.email}`,
                name: `${data.firstname}`,
              },
            },
          ],
          subject: "Test Email",
          htmlbody: "<div><b> Test email sent successfully.</b></div>",
        })
        .then((resp) => {
          console.log("success");
          res.send(resp);
        })
        .catch((error) => {
          console.log("error");
          res.send(error);
        });

      const { _id } = data._doc;

      // res.status(200).json({
      //   success: true,
      //   msg: "check your mail for your verification code",
      //   data: { id: _id, token },
      // });
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

const verifyOTP = async (req, res, next) => {
  try {
    // const userInfo = await User.findById(req.params.id);

    // if (userInfo._id === req.user.id) {
    const code = req.body.code;

    const verify = req.user.token;

    if (code === verify) {
      return res.status(200).json({ success: true, msg: "verification okay" });
    } else {
      return res.status(400).json({ success: false, msg: "Token has expired" });
    }
    // } else {
    //   return res.status(400).json({ success: false, msg: "Invalid user" });
    // }
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
        // secure: false,
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
      check.kodeHex = req.body.kodeHex;
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
