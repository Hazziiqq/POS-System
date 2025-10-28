import express from "express";
import pool from "./config/db";
import { initProductTable } from "./models/productModel";
import productRoute from "./routes/productRoute"
import { initSalesTable } from "./models/salesModel";
import salesRoute from "./routes/salesRoute"
import  reportRoute  from "./routes/reportRoute";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DEBUG MIDDLEWARE - Add this temporarily
app.use((req, res, next) => {
  console.log('=== Incoming Request ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Content-Type:', req.headers['content-type']);
  console.log('Body:', req.body);
  console.log('Body type:', typeof req.body);
  console.log('========================');
  next();
});

// Initialize product table
initProductTable();
initSalesTable();

// Test DB route 
app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.send(`Server is running. DB time: ${result.rows[0].now}`);
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).send("Database error");
  }
});

// Use product routes
app.use("/api/products", productRoute);
app.use("/api/sales", salesRoute)
app.use("/api/reports", reportRoute);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));