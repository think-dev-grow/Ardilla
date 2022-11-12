const Users = require("../models/User");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const handleError = require("../utils/error");

const { Random } = require("random-js");
const random = new Random();

const randomize = require("randomatic");

const rn = require("random-number");

const options = {
  min: 100,
  max: 999,
  integer: true,
};

const nodeMailer = require("nodemailer");

let transporter = nodeMailer.createTransport({
  host: "smtp.zoho.com",
  secure: true,
  port: 465,
  auth: {
    user: "Rex.atuzie@leapsail.com.ng",
    pass: "rexatuzie",
  },
});

const register = async (req, res, next) => {
  try {
    const check = await Users.findOne({ email: req.body.email });

    if (check?.platform === "Ardilla")
      return next(handleError(404, "User already exist."));

    // const salt = bcrypt.genSaltSync(10);
    // const hash = bcrypt.hashSync(req.body.password, salt);

    if (check) {
      const { firstname, lastname, email, dhid, contact, uid, password } =
        check;

      let value = randomize("0", 7);

      const user = new Users({
        firstname,
        lastname,
        email,
        emailToken: value,
        contact,
        dhid,
        uid,
        password,
      });

      const data = await user.save();

      const mail = {
        from: ' "Verify your email" <Rex.atuzie@leapsail.com.ng>',
        to: email,
        subject: "Arilla Email verification",
        html: `<p> Please use the OTP code below to complete your accout setting</p>
        <h1>${data.emailToken}</h1>
       
         `,
      };

      transporter.sendMail(mail, (err, info) => {
        if (err) {
          console.log(err);
        } else {
          console.log(info);
        }
      });

      res.status(200).json({
        success: "true",
        msg: " user created successfully",
        data,
      });
    } else {
      let value = randomize("0", 7);
      const user = new Users({ ...req.body, emailToken: value });

      // const user = new Users({
      //   firstname: req.body.firstname,
      //   lastname: req.body.lastname,
      //   email: req.body.email,
      //   emailToken: value,
      //   contact: req.body.contact,
      //   dhid: crypto.randomBytes(64).toString("hex"),
      //   uid: `30${rn(options)}${random.integer(10, 99)}${randomize("0", 3)}`,
      //   password: hash,
      // });

      const data = await user.save();

      res.send(data);

      // const mail = {
      //   from: ' "Verify your email" <Rex.atuzie@leapsail.com.ng>',
      //   to: data.email,
      //   subject: "Ardilla Email verification",
      //   html: `<p> Please use the OTP code below to complete your accout setting</p>
      //     <h1>${data.emailToken}</h1>

      //    `,
      // };

      // transporter.sendMail(mail, (err, info) => {
      //   if (err) {
      //     next(handleError(400, "Oops , something went wrong."));
      //   } else {
      //     console.log(info);
      //   }
      // });

      // res.status(200).json({
      //   success: "true",
      //   msg: "user created successfully",
      //   data,
      // });
    }
  } catch (error) {
    console.log(error);
    next(handleError(500, "Oops , something went wrong."));
  }
};

const login = async (req, res, next) => {
  try {
    const uid = req.body.uid;

    const user = await Users.findOne({ uid });

    if (user.platform !== "Hargon") {
      const { firstname, lastname, email, dhid, contact, uid, password } = user;

      const createUser = new Users({
        firstname,
        lastname,
        email,
        contact,
        dhid,
        uid,
        password,
      });

      await createUser.save();

      const confirmPassword = await bcrypt.compare(req.body.password, password);
      if (!confirmPassword)
        return next(handleError(400, "Password incorrect."));

      res.status(200).json({
        success: "true",
        msg: "Login successfull",
      });
    } else {
    }
  } catch (error) {
    console.log(error);
    next(handleError(500, "Oops , something went wrong."));
  }
};

module.exports = { register, login };
