const express = require("express");
const { register, login, logOut } = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logOut);

module.exports = router;
