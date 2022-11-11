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

const register = async (req, res, next) => {
  try {
    const check = await Users.findOne({ email: req.body.email });

    if (check.platform === "Ardilla")
      return next(handleError(404, "User already exist."));

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    if (check) {
      const { firstname, lastname, email, dhid, contact, uid, password } =
        check;

      const user = new Users({
        firstname,
        lastname,
        email,
        contact,
        dhid,
        uid,
        password,
      });

      await user.save();

      res.status(200).json({
        success: "true",
        msg: " user created successfully",
        data: user,
      });
    } else {
      const user = new Users({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        contact: req.body.contact,
        dhid: crypto.randomBytes(64).toString("hex"),
        uid: `30${rn(options)}${random.integer(10, 99)}${randomize("0", 3)}`,
        password: hash,
      });

      await user.save();

      res.status(200).json({
        success: "true",
        msg: "user created successfully",
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    next(handleError(500, "Oops , something went wrong."));
  }
};

module.exports = { register };
