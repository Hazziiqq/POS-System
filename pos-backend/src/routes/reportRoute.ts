import express from "express";
import { dailyReport, weeklyReport, monthlyReport, topProducts, lowStock, totalSales
} from "../controllers/reportController";

const router = express.Router();

// Reports
router.get("/daily", dailyReport);
router.get("/weekly", weeklyReport);
router.get("/monthly", monthlyReport);

// Product performance reports
router.get("/top-products", topProducts);
router.get("/low-stock", lowStock);

//total sales
router.get("/total-sales", totalSales);


export default router;
