const express = require("express");

const router = express.Router();

const {
  authenticateUser,
  permissions,
} = require("../middleware/authentication");

const {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");
const { default: mongoose } = require("mongoose");

router.post("/", authenticateUser, createReview);
router.get("/", getAllReviews);
router.get("/:id", getSingleReview);
router.patch("/:id", authenticateUser, updateReview);
router.delete("/:id", authenticateUser, deleteReview);

module.exports = router;
