import express from "express";
import pool from "./config/db";
import { initProductTable } from "./models/productModel";
import productRoutes from "./routes/productRoute"

const app = express();

// Middleware
app.use(express.json());

// Initialize product table
initProductTable();

// Test DB route 
app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.send(`✅ Server is running. DB time: ${result.rows[0].now}`);
  } catch (error) {
    console.error("❌ Database query error:", error);
    res.status(500).send("Database error");
  }
});

// Use product routes
app.use("/api/products", productRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
