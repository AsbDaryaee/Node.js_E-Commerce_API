const express = require("express");

const router = express.Router();

const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  deleteProduct,
  updateProduct,
  uploadImage,
} = require("../controllers/productController");

const { getSingleProductReviews } = require("../controllers/reviewController");

const {
  authenticateUser,
  permissions,
} = require("../middleware/authentication");

router.post("/", [authenticateUser, permissions("admin")], createProduct);
router.get("/", getAllProducts);
router.post(
  "/uploadImage",
  [authenticateUser, permissions("admin")],
  uploadImage
);
router.get("/:id", getSingleProduct);
router.patch("/:id", [authenticateUser, permissions("admin")], updateProduct);
router.delete("/:id", [authenticateUser, permissions("admin")], deleteProduct);

router.get("/:id/reviews", getSingleProductReviews);

module.exports = router;
