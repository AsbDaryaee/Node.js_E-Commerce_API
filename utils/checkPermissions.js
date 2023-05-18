const CustomError = require("../errors");

const checkPermissions = (requestUser, resourceUserId) => {
  //     console.log(requestUser);
  //     console.log(resourceUserId);
  //   console.log(typeof requestUser);

  //   admin can access
  if (requestUser.role === "admin") return;

  //   users can access to thier profile data
  if (requestUser.userId === resourceUserId.toString()) return;

  //    other User's cant access to other's profile data
  throw new CustomError.UnauthenticatedError(
    "Not Authorized to access this routeّ"
  );
};

module.exports = checkPermissions;
