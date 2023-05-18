const express = require("express");
const router = express.Router();

const {
  createOrder,
  getAllOrders,
  getCurrentUserOrder,
  getSingleOrder,
  updateOrder,
} = require("../controllers/orderController");

const {
  authenticateUser,
  permissions,
} = require("../middleware/authentication");

router.post("/", authenticateUser, createOrder);
router.get("/", [authenticateUser, permissions("admin")], getAllOrders);
router.get("/my_orders", authenticateUser, getCurrentUserOrder);
router.get("/:id", [authenticateUser, permissions("admin")], getSingleOrder);
router.patch("/:id", authenticateUser, updateOrder);

module.exports = router;
