const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Load your existing product data - FIX THE PATH HERE
const loadProducts = () => {
  // Go up one directory from mock-server to root, then to public/data.json
  const dataPath = path.join(__dirname, "..", "public", "data.json");
  return JSON.parse(fs.readFileSync(dataPath, "utf8"));
};

// In-memory storage for demo (in real app, you'd use a database)
let products = loadProducts();
let carts = {}; // userId -> cart items
let orders = [];
let orderIdCounter = 1000;

// Products endpoints
app.get("/api/products", (req, res) => {
  console.log("📦 GET /api/products - Fetching all products");
  res.json(products);
});

app.get("/api/products/:id", (req, res) => {
  const product = products.find((p) => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  res.json(product);
});

// Cart endpoints
app.get("/api/cart/:userId", (req, res) => {
  const { userId } = req.params;
  console.log(`🛒 GET /api/cart/${userId} - Fetching cart`);

  const userCart = carts[userId] || [];
  res.json({ items: userCart });
});

app.post("/api/cart/:userId/items", (req, res) => {
  const { userId } = req.params;
  const product = req.body;

  console.log(`🛒 POST /api/cart/${userId}/items - Adding:`, product.name);

  if (!carts[userId]) {
    carts[userId] = [];
  }

  const existingItem = carts[userId].find((item) => item.name === product.name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    carts[userId].push({ ...product, quantity: 1 });
  }

  res.json({ success: true, cart: carts[userId] });
});

app.put("/api/cart/:userId/items/:itemName", (req, res) => {
  const { userId, itemName } = req.params;
  const { quantity } = req.body;

  console.log(
    `🛒 PUT /api/cart/${userId}/items/${itemName} - Quantity:`,
    quantity
  );

  if (!carts[userId]) {
    return res.status(404).json({ error: "Cart not found" });
  }

  const item = carts[userId].find(
    (item) => item.name === decodeURIComponent(itemName)
  );
  if (!item) {
    return res.status(404).json({ error: "Item not found in cart" });
  }

  item.quantity = quantity;
  res.json({ success: true, cart: carts[userId] });
});

app.delete("/api/cart/:userId/items/:itemName", (req, res) => {
  const { userId, itemName } = req.params;

  console.log(
    `🛒 DELETE /api/cart/${userId}/items/${itemName} - Removing item`
  );

  if (!carts[userId]) {
    return res.status(404).json({ error: "Cart not found" });
  }

  carts[userId] = carts[userId].filter(
    (item) => item.name !== decodeURIComponent(itemName)
  );
  res.json({ success: true, cart: carts[userId] });
});

app.delete("/api/cart/:userId", (req, res) => {
  const { userId } = req.params;
  console.log(`🛒 DELETE /api/cart/${userId} - Clearing cart`);

  carts[userId] = [];
  res.json({ success: true });
});

// Orders endpoints
app.post("/api/orders", (req, res) => {
  const orderData = req.body;
  const orderId = `order_${orderIdCounter++}`;

  console.log(`📋 POST /api/orders - Creating order:`, orderId);

  const order = {
    id: orderId,
    ...orderData,
    status: "confirmed",
    createdAt: new Date().toISOString(),
  };

  orders.push(order);

  // Clear the user's cart after successful order
  if (orderData.userId) {
    carts[orderData.userId] = [];
  }

  res.json(order);
});

app.get("/api/orders/:orderId", (req, res) => {
  const order = orders.find((o) => o.id === req.params.orderId);
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }
  res.json(order);
});

app.get("/api/orders/user/:userId", (req, res) => {
  const userOrders = orders.filter((o) => o.userId === req.params.userId);
  res.json(userOrders);
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Mock API server is running!",
    endpoints: [
      "GET /api/products",
      "GET /api/cart/:userId",
      "POST /api/cart/:userId/items",
      "POST /api/orders",
    ],
  });
});

// Start server
app.listen(PORT, () => {
  console.log("🚀 Mock API Server running on http://localhost:3001");
  console.log("📍 Health check: http://localhost:3001/api/health");
  console.log("📦 Products: http://localhost:3001/api/products");
  console.log("📋 Ready for frontend integration!");
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n👋 Shutting down mock server...");
  process.exit(0);
});
