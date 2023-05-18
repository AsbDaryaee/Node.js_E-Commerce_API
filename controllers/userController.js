const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const User = require("../models/user");
const {
  createTokenUser,
  attachCookiesToResponse,
  checkPermissions,
} = require("../utils");

const getAllUsers = async (req, res) => {
  const allUsers = await User.find({ role: "user" })
    .select("-password")
    .select("-__v");
  res
    .status(StatusCodes.OK)
    .json({ Total: allUsers.length, AllUsers: allUsers });
};

const getSingleUser = async (req, res) => {
  const { id: userId } = req.params;

  const user = await User.findById(userId).select("-password")

  if (!user) {
    throw new CustomError.NotFoundError("User Doesn't Exist.");
  }

  checkPermissions(req.user, user._id);

  res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

const updateUser = async (req, res) => {
  const { name, email } = req.body;
  const { userId } = req.user;

  if (!name || !email) {
    throw new CustomError.BadRequestError(
      "Please Provide a Name and an Email Address."
    );
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { email, name },
    { new: true, runValidators: true }
  );

  const tokenUser = createTokenUser(user);

  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.OK).json(tokenUser);
};

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const { userId } = req.user;

  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError(
      "Please Provide Your current and a new password"
    );
  }

  const user = await User.findById(userId);

  const passwordCheck = await user.comparePassword(oldPassword);

  if (!passwordCheck) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials.");
  }

  user.password = newPassword;

  await user.save();

  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now() + 5000),
  });

  res
    .status(StatusCodes.OK)
    .json({ msg: "Password Changed Successfully. Login Again." });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
