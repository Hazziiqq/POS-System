import express from "express";
import { createSale, getAllSales } from "../contollers/salesController";
const router = express.Router();

// ✅ Add a new sale
router.post("/", createSale);

// ✅ Get all sales
router.get("/", getAllSales);

export default router;
