const express = require("express");
const router = express.Router();

// Load your existing data.json (one level up from server/)
const productsData = require("../../public/data.json");

// GET /api/products - Get all products
router.get("/", (req, res) => {
  try {
    console.log(`📦 Fetching ${productsData.length} products`);

    res.json({
      success: true,
      data: productsData,
      count: productsData.length,
      message: "Products fetched successfully",
    });
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
});

module.exports = router;