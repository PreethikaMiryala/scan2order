const express = require("express");

const { createOrder, listOrders, patchOrderStatus } = require("../controllers/orderController");

const router = express.Router();

router.post("/", createOrder);
router.get("/", listOrders);
router.patch("/:orderId/status", patchOrderStatus);

module.exports = router;

