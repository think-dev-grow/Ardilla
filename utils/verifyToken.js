const jwt = require("jsonwebtoken");
const handleError = require("./error");

const jwtSecret = "123456789";

const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return next(handleError(401, "Unauthorized"));

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) return next(createError(403, "token not valid"));

    req.user = user;
    next();
  });
};

module.exports = { verifyToken };
