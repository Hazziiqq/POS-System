import express from "express";
import { dailyReport, weeklyReport, monthlyReport, topProducts, lowStock,
} from "../controllers/reportController";

const router = express.Router();

// Reports
router.get("/daily", dailyReport);
router.get("/weekly", weeklyReport);
router.get("/monthly", monthlyReport);

// Product performance reports
router.get("/top-products", topProducts);
router.get("/low-stock", lowStock);

export default router;
