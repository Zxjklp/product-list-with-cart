const express = require("express");
const router = express.Router();

// In-memory cart storage (later we'll use database)
let carts = {};

// GET /api/cart/:sessionId - Get cart for session
router.get("/:sessionId", (req, res) => {
  try {
    const { sessionId } = req.params;
    const cart = carts[sessionId] || [];

    res.json({
      success: true,
      data: cart,
      sessionId,
      message: "Cart fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch cart",
      error: error.message,
    });
  }
});

module.exports = router;