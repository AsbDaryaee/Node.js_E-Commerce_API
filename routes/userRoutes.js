const express = require("express");

const router = express.Router();

const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} = require("../controllers/userController");

const {
  authenticateUser,
  permissions,
} = require("../middleware/authentication");

router.use(authenticateUser);

router.get("/showMe", showCurrentUser);

// permissions - Vid 31 - Explaination
router.get("/", permissions("admin", "owner"), getAllUsers);

router.get("/:id", getSingleUser);
router.patch("/updateUser", updateUser);
router.patch("/updateUserPassword", updateUserPassword);

module.exports = router;
