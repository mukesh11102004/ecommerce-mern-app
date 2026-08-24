const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const {
  checkout,
  getMyOrders,
  markOrderAsShipped,
} = require("../controllers/orderController");

const router = express.Router();

router.post("/checkout", authMiddleware, checkout);
router.get("/", authMiddleware, getMyOrders);
router.put("/:orderId/ship", authMiddleware, markOrderAsShipped);

module.exports = router;
