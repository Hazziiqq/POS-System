import express from "express";
import cors from "cors";
import pool from "./config/db";
import { initProductTable } from "./models/productModel";
import productRoute from "./routes/productRoute";
import { initSalesTable } from "./models/salesModel";
import salesRoute from "./routes/salesRoute";
import reportRoute from "./routes/reportRoute";
import { initCustomerTable } from "./models/customerModel";
import customerRoute from "./routes/customerRoute"
const app = express();

// Enable CORS
app.use(
  cors({
    origin: "http://localhost:1212",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize tables
initProductTable();
initCustomerTable();
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

// Routes
app.use("/api/products", productRoute);
app.use("/api/sales", salesRoute);
app.use("/api/reports", reportRoute);
app.use("/api/customers",customerRoute)
const PORT = 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
