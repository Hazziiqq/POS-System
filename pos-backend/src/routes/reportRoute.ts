import express from "express";
import { getDailyReport, getWeeklyReport, getMonthlyReport, getLowStockProducts, getTopProducts } from "../models/reportModel";

const router = express.Router();

router.get("/daily", getDailyReport);
router.get("/weekly", getWeeklyReport);
router.get("/monthly", getMonthlyReport);
router.get("/top-products", getTopProducts);
router.get("/low-stock", getLowStockProducts);

export default router;
