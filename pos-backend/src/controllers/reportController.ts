import { Request, Response } from "express";
import {  getDailyReport,  getWeeklyReport,  getMonthlyReport,  getTopProducts,  getLowStockProducts,  getTotalSales 
} from "../models/reportModel";

// Daily Report
export const dailyReport = async (req: Request, res: Response) => {
  try {
    const data = await getDailyReport();
    res.status(200).json({ message: "Daily report generated", data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Weekly Report
export const weeklyReport = async (req: Request, res: Response) => {
  try {
    const data = await getWeeklyReport();
    res.status(200).json({ message: "Weekly report generated", data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Monthly Report
export const monthlyReport = async (req: Request, res: Response) => {
  try {
    const data = await getMonthlyReport();
    res.status(200).json({ message: "Monthly report generated", data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Top Products
export const topProducts = async (req: Request, res: Response) => {
  try {
    const data = await getTopProducts();
    res.status(200).json({ message: "Top products fetched", data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Low Stock Products
export const lowStock = async (req: Request, res: Response) => {
  try {
    const data = await getLowStockProducts();
    res.status(200).json({ message: "Low stock products fetched", data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Total Sales
export const totalSales = async (req: Request, res: Response) => {
  try {
    const data = await getTotalSales();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
