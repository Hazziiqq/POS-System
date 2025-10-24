import express from "express";
import { createProduct, getAllProducts } from "../contollers/productController";

const router = express.Router();

// ✅ Route: Add a new product
router.post("/", createProduct);

// ✅ Route: Get all products
router.get("/", getAllProducts);

export default router;
