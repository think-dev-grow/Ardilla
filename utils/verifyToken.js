const jwt = require("jsonwebtoken");
const handleError = require("./error");

const jwtSecret = "123456789";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, jwtSecret, (err, user) => {
      if (err) return next(handleError(403, "token not valid"));

      req.user = user;
      next();
    });
  } else {
    return next(handleError(401, "Unauthorized"));
  }
};

module.exports = { verifyToken };
