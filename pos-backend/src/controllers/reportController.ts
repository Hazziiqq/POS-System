import { Request, Response } from "express";
import pool from "../config/db";
import { getDailyReport, getWeeklyReport, getMonthlyReport, getTopProducts, getLowStockProducts } from "../models/reportModel";

// Daily Report
export const dailyReport = async (req: Request, res: Response) => {
  try {
    const data = await getDailyReport();
    res.status(200).json({ message: "Daily report generated", data });
  } catch (error) {
    console.error("Error generating daily report:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Weekly Report
export const weeklyReport = async (req: Request, res: Response) => {
  try {
    const data = await getWeeklyReport();
    res.status(200).json({ message: "Weekly report generated", data });
  } catch (error) {
    console.error("Error generating weekly report:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Monthly Report
export const monthlyReport = async (req: Request, res: Response) => {
  try {
    const data = await getMonthlyReport();
    res.status(200).json({ message: "Monthly report generated", data });
  } catch (error) {
    console.error("Error generating monthly report:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Top selling Products
export const topProducts = async (req: Request, res: Response) => {
  try {
    const data = await getTopProducts();
    res.status(200).json({ message: "Top products fetched", data });
  } catch (error) {
    console.error("Error fetching top products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Low Stock Products
export const lowStock = async (req: Request, res: Response) => {
  try {
    const data = await getLowStockProducts();
    res.status(200).json({ message: "Low stock products fetched", data });
  } catch (error) {
    console.error("Error fetching low stock products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Total Sales
export const totalSales = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT 
        SUM(quantity) AS total_items_sold,
        SUM(total_price) AS total_revenue
      FROM sales;
    `);

    res.status(200).json({
      totalSales: result.rows[0].total_items_sold ?? 0,
      totalRevenue: result.rows[0].total_revenue ?? 0,
    });
  } catch (error) {
    console.error("Error fetching total sales:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
