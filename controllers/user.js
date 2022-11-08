const Users = require("../models/User");

const crypto = require("crypto");

const { Random } = require("random-js");
const random = new Random();
const value = random.integer(10, 99);

const randomize = require("randomatic");
const int = randomize("0", 3);

const rn = require("random-number");
const options = {
  min: 100,
  max: 999,
  integer: true,
};
const digit = rn(options);

const register = async (req, res) => {
  try {
    const check = await Users.findOne({ email: req.body.email });

    if (check) {
      const { firstname, lastname, email, dhid, contact, uid } = check;

      const user = new Users({
        firstname,
        lastname,
        email,
        contact,
        dhid,
        uid,
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
        uid: `30${value}${int}${digit}`,
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
  }
};

module.exports = { register };
