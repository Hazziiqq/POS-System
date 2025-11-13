import express from "express";
import { createPurchase, getAllPurchases } from "../controllers/purchaseController";

const router = express.Router();

// Add a new purchase
router.post("/", createPurchase);

// Get all purchases
router.get("/", getAllPurchases);

export default router;
