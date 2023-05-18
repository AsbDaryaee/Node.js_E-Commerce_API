const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const jwt = require("jsonwebtoken");
const verifyJWT = require("../utils");
const { verifyToken } = require("../utils/jwt");

const authenticateUser = async (req, res, next) => {
  const { token } = req.signedCookies;

  if (!token) {
    throw new CustomError.BadRequestError("Authentication Failed");
  }

  // Used TryCatch Because of the custom Error I want to send
  try {
    const payload = verifyToken({ token });

    req.user = {
      name: payload.name,
      userId: payload.userId,
      role: payload.role,
    };

    next();
  } catch (error) {
    throw new CustomError.BadRequestError("Authentication Failed");
  }
};

// Explaination on Vid 31
const permissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.forbiddenError("You Connot access to this route.");
    }
    next();
  };
};

module.exports = { authenticateUser, permissions };
