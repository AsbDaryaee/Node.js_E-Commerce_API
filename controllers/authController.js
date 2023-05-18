const User = require("../models/user");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { attachCookiesToResponse, createTokenUser } = require("../utils");

const register = async (req, res) => {
  const { email, name, password } = req.body;

  const emailCheck = await User.findOne({ email });

  if (emailCheck) {
    throw new CustomError.BadRequestError("The User Already Exist");
  }

  //I don't want to users can set their role: admin || I could write User.create(req.body) {risky}
  const user = await User.create({ email, name, password });

  const tokenUser = createTokenUser(user);

  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError("Please Provide Email and Password.");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials.");
  }

  const checkPassword = await user.comparePassword(password);

  if (!checkPassword) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials.");
  }

  const tokenUser = createTokenUser(user);

  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const logOut = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now() + 5000),
  });

  res.status(StatusCodes.OK).json({ msg: "Come Back Soon" });
};

module.exports = {
  register,
  login,
  logOut,
};
