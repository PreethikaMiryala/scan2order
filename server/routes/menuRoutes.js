const express = require("express");

const {
  createMenuItem,
  getMenuItems,
  updateMenuItem,
  deleteMenuItem,
} = require("../controllers/menuController");

const router = express.Router();

router.post("/", createMenuItem);
router.get("/:restaurant_id", getMenuItems);
router.patch("/:id", updateMenuItem);
router.delete("/:id", deleteMenuItem);

module.exports = router;
