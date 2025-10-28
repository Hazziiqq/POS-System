import express from "express";
import { createProduct, getAllProducts, editProduct, removeProduct } from "../controllers/productController";

const router = express.Router();

// Route: Add a new product
router.post("/", createProduct);

// Route: Get all products
router.get("/", getAllProducts);

// Update product
router.put("/:id", editProduct);

// Delete product
router.delete("/:id", removeProduct);


export default router;
